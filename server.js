const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { EmailClient } = require('@azure/communication-email');
const { AzureKeyCredential } = require('@azure/core-auth');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

const AZURE_COMMUNICATION_CONNECTION_STRING = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const AZURE_COMMUNICATION_ENDPOINT = process.env.AZURE_COMMUNICATION_ENDPOINT || process.env.ACS_ENDPOINT || process.env.ACS_EMAIL_ENDPOINT;
const AZURE_COMMUNICATION_ACCESS_KEY = process.env.AZURE_COMMUNICATION_ACCESS_KEY || process.env.ACS_ACCESS_KEY || process.env.ACS_EMAIL_ACCESS_KEY;
const MAIL_TO = process.env.MAIL_TO || 'info@leoHOST.org';
const MAIL_FROM = process.env.MAIL_FROM || 'DoNotReply@hostleos.org.lk';
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Leo Club of Colombo HOST';

let emailClient = null;
if (AZURE_COMMUNICATION_CONNECTION_STRING) {
  emailClient = new EmailClient(AZURE_COMMUNICATION_CONNECTION_STRING);
} else if (AZURE_COMMUNICATION_ENDPOINT && AZURE_COMMUNICATION_ACCESS_KEY) {
  emailClient = new EmailClient(AZURE_COMMUNICATION_ENDPOINT, new AzureKeyCredential(AZURE_COMMUNICATION_ACCESS_KEY));
}

function ensureEmailClient() {
  if (!emailClient) {
    throw new Error('Azure Communication Email client is not configured. Set AZURE_COMMUNICATION_CONNECTION_STRING or AZURE_COMMUNICATION_ENDPOINT and AZURE_COMMUNICATION_ACCESS_KEY.');
  }
}

async function sendAcsEmail(message) {
  ensureEmailClient();
  const poller = await emailClient.beginSend(message);
  const result = await poller.pollUntilDone();
  if (!result || result.status !== 'Succeeded') {
    const errorText = result?.error ? JSON.stringify(result.error) : `status=${result?.status}`;
    throw new Error(`Azure Communication Email send failed: ${errorText}`);
  }
  return result;
}

function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        callback(JSON.parse(body));
      } else {
        callback(querystring.parse(body));
      }
    } catch (error) {
      callback({});
    }
  });
}

function sendContactNotification({ name, email, message }) {
  const payload = {
    senderAddress: MAIL_FROM,
    content: {
      subject: `New website contact from ${name}`,
      plainText: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
    },
    recipients: {
      to: [
        {
          address: MAIL_TO,
          displayName: 'Website Contact',
        },
      ],
    },
    replyTo: [
      {
        address: email,
        displayName: name,
      },
    ],
  };

  return sendAcsEmail(payload);
}

function sendUserConfirmation({ name, email, message }) {
  const payload = {
    senderAddress: MAIL_FROM,
    content: {
      subject: `We received your message, ${name}`,
      plainText: `Hi ${name},\n\nThanks for contacting us. We have received your message and will respond as soon as possible.\n\nYour message:\n${message}\n\nBest regards,\nLeo Club of Colombo HOST`,
      html: `<p>Hi ${name},</p><p>Thanks for contacting us. We have received your message and will respond as soon as possible.</p><p><strong>Your message:</strong><br>${message.replace(/\n/g, '<br>')}</p><p>Best regards,<br>Leo Club of Colombo HOST</p>`,
    },
    recipients: {
      to: [
        {
          address: email,
          displayName: name,
        },
      ],
    },
    replyTo: [
      {
        address: MAIL_TO,
        displayName: 'Leo Club of Colombo HOST',
      },
    ],
  };

  return sendAcsEmail(payload);
}

const server = http.createServer((req, res) => {
  let requestUrl;
  let requestPath;
  try {
    requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    requestPath = decodeURIComponent(requestUrl.pathname);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  const redirects = {
    '/impact.html': '/mission-impact.html',
    '/mission.html': '/mission-impact.html',
    '/how-we-serve.html': '/Our%20Services.html',
  };
  if (redirects[requestPath]) {
    res.writeHead(301, { Location: `${redirects[requestPath]}${requestUrl.search}` });
    res.end();
    return;
  }

  if (requestPath === '/contact' && req.method === 'POST') {
    parseRequestBody(req, async (body) => {
      const name = (body.name || '').trim();
      const email = (body.email || '').trim();
      const message = (body.message || '').trim();

      if (!name || !email || !message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Please fill in all fields.' }));
        return;
      }

      try {
        const ownerResult = await sendContactNotification({ name, email, message });
        const userResult = await sendUserConfirmation({ name, email, message });
        console.log('Email send results:', { ownerResult, userResult });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, ownerResult, userResult }));
      } catch (error) {
        console.error('Email error:', error);
        const detail = (error && error.message) ? error.message : String(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to send message. Please try again later.', detail }));
      }
    });
    return;
  }

  const requestedFile = requestPath === '/' ? 'index.html' : requestPath.replace(/^[/\\]+/, '');
  const filePath = path.resolve(__dirname, requestedFile);

  if (path.relative(__dirname, filePath).startsWith('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Server Error');
      }
    } else {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };
      const contentType = mimeTypes[ext] || 'text/plain';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});
