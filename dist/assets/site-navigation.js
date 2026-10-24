function initializeMobileNavigation() {
  const sidebar = document.querySelector(".site-sidebar");
  const navigation = document.querySelector(".main-nav");
  const toggle = document.querySelector(".nav-toggle");

  if (sidebar && navigation && toggle) {
    const closeMenu = (returnFocus = false) => {
      sidebar.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    };

    sidebar.classList.add("has-mobile-menu");
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      sidebar.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (window.matchMedia("(max-width: 900px)").matches && !sidebar.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) closeMenu(true);
    });

    const desktopViewport = window.matchMedia("(min-width: 901px)");
    if (desktopViewport.addEventListener) {
      desktopViewport.addEventListener("change", () => closeMenu());
    } else {
      desktopViewport.addListener(() => closeMenu());
    }
  }

  initializeSiteIntro();
  initializeScrollMotion();
  initializeImmersiveMotion();
  initializeWebGLScenes();
}

function initializeWebGLScenes() {
  const hosts = document.querySelectorAll(".home-hero-card, .page-hero");
  const vertexSource = `
    precision mediump float;
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform float uTime;
    uniform float uAspect;
    uniform float uScale;
    uniform float uCenterX;
    uniform vec2 uTilt;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float yaw = uTime * 0.18 + uTilt.x;
      float pitch = sin(uTime * 0.13) * 0.08 + uTilt.y;
      float cy = cos(yaw);
      float sy = sin(yaw);
      float cx = cos(pitch);
      float sx = sin(pitch);
      vec3 p = vec3(cy * aPosition.x + sy * aPosition.z, aPosition.y, -sy * aPosition.x + cy * aPosition.z);
      p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
      float depth = 3.2 + p.z;
      vec2 projected = p.xy * (uScale / depth);
      projected.x = projected.x / uAspect + uCenterX;
      gl_Position = vec4(projected, (depth - 2.2) / 3.2, 1.0);
      vNormal = vec3(cy * aNormal.x + sy * aNormal.z, aNormal.y, -sy * aNormal.x + cy * aNormal.z);
      vPosition = p;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 light = normalize(vec3(-0.45, 0.62, 0.85));
      float diffuse = max(dot(normal, light), 0.0);
      float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
      float current = sin(vPosition.y * 8.0 + vPosition.x * 5.0 - uTime * 0.42) * 0.5 + 0.5;
      vec3 deepBlue = vec3(0.035, 0.12, 0.27);
      vec3 brightBlue = vec3(0.20, 0.40, 0.66);
      vec3 gold = vec3(0.88, 0.66, 0.29);
      vec3 color = mix(deepBlue, brightBlue, diffuse * 0.85 + 0.08);
      color = mix(color, gold, smoothstep(0.70, 0.98, current) * 0.58);
      color += fresnel * vec3(0.34, 0.54, 0.84);
      color += pow(max(dot(normal, light), 0.0), 10.0) * vec3(0.82, 0.69, 0.44);
      gl_FragColor = vec4(color, 0.88);
    }
  `;

  for (const host of hosts) {
    const canvas = document.createElement("canvas");
    canvas.className = "immersive-scene-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("focusable", "false");
    const context = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
      premultipliedAlpha: false,
    });

    if (!context) continue;

    const gl = context;
    const createShader = (type, source, label) => {
      const shader = gl.createShader(type);
      if (!shader) {
        console.error(`Unable to create the ${label} WebGL shader.`);
        return null;
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Unable to compile the ${label} WebGL shader: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource, "vertex");
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource, "fragment");
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      continue;
    }

    const program = gl.createProgram();
    if (!program) {
      console.error("Unable to create the immersive WebGL program.");
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      continue;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Unable to link the immersive WebGL program: ${gl.getProgramInfoLog(program)}`);
      gl.deleteProgram(program);
      continue;
    }

    const attributes = {
      position: gl.getAttribLocation(program, "aPosition"),
      normal: gl.getAttribLocation(program, "aNormal"),
    };
    const uniforms = {
      time: gl.getUniformLocation(program, "uTime"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      scale: gl.getUniformLocation(program, "uScale"),
      centerX: gl.getUniformLocation(program, "uCenterX"),
      tilt: gl.getUniformLocation(program, "uTilt"),
    };

    if (attributes.position < 0 || attributes.normal < 0 || Object.values(uniforms).some((uniform) => uniform === null)) {
      console.error("The immersive WebGL scene is missing a required shader attribute or uniform.");
      gl.deleteProgram(program);
      continue;
    }

    const latitudes = 36;
    const longitudes = 48;
    const vertices = [];
    const indices = [];

    for (let latitude = 0; latitude <= latitudes; latitude += 1) {
      const theta = (latitude * Math.PI) / latitudes;
      const y = Math.cos(theta);
      const ringRadius = Math.sin(theta);

      for (let longitude = 0; longitude <= longitudes; longitude += 1) {
        const phi = (longitude * 2 * Math.PI) / longitudes;
        const x = ringRadius * Math.cos(phi);
        const z = ringRadius * Math.sin(phi);
        vertices.push(x, y, z, x, y, z);
      }
    }

    for (let latitude = 0; latitude < latitudes; latitude += 1) {
      for (let longitude = 0; longitude < longitudes; longitude += 1) {
        const first = latitude * (longitudes + 1) + longitude;
        const next = first + longitudes + 1;
        indices.push(first, next, first + 1, next, next + 1, first + 1);
      }
    }

    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!vertexBuffer || !indexBuffer) {
      console.error("Unable to allocate buffers for the immersive WebGL scene.");
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      continue;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    host.insertBefore(canvas, host.firstChild);
    host.classList.add("has-immersive-scene");
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(attributes.position);
    gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(attributes.normal);
    gl.vertexAttribPointer(attributes.normal, 3, gl.FLOAT, false, 24, 12);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = true;
    let animationFrame = 0;
    let startTime = 0;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (timestamp) => {
      animationFrame = 0;
      if (document.hidden || !isVisible) return;

      const elapsed = reducedMotion.matches ? 0 : (timestamp - startTime) / 1000;
      const style = window.getComputedStyle(host);
      const tiltX = (parseFloat(style.getPropertyValue("--scene-tilt-x")) || 0) * Math.PI / 180;
      const tiltY = (parseFloat(style.getPropertyValue("--scene-tilt-y")) || 0) * Math.PI / 180;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
      gl.uniform1f(uniforms.scale, host.classList.contains("home-hero-card") ? 1.15 : 2.05);
      gl.uniform1f(uniforms.centerX, host.classList.contains("home-hero-card") ? 1.20 : 0.58);
      gl.uniform2f(uniforms.tilt, tiltX, tiltY);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      if (!reducedMotion.matches) animationFrame = window.requestAnimationFrame(draw);
    };

    const refresh = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (!startTime) startTime = performance.now();
      draw(performance.now());
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        refresh();
      }
    };

    resize();
    refresh();
    window.addEventListener("resize", () => {
      resize();
      refresh();
    });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", refresh);
    } else {
      reducedMotion.addListener(refresh);
    }

    if ("IntersectionObserver" in window) {
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          refresh();
        } else if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      });
      visibilityObserver.observe(host);
    }
  }
}

function initializeScrollMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    return;
  }

  const elements = document.querySelectorAll(".site-main > section, .site-main > .site-footer, .team-grid > .card");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, activeObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        activeObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });

  for (const element of elements) {
    observer.observe(element);
    element.classList.add("motion-reveal");
  }
}

function initializeImmersiveMotion() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (reducedMotion.matches || !finePointer.matches) return;

  const scenes = document.querySelectorAll(".page-hero, .home-hero-card, .home-media-card");

  for (const scene of scenes) {
    scene.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;

      const bounds = scene.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

      scene.style.setProperty("--scene-tilt-x", `${vertical * -6}deg`);
      scene.style.setProperty("--scene-tilt-y", `${horizontal * 8}deg`);
      scene.style.setProperty("--scene-light-x", `${(horizontal + 0.5) * 100}%`);
      scene.style.setProperty("--scene-light-y", `${(vertical + 0.5) * 100}%`);
    });

    scene.addEventListener("pointerleave", () => {
      scene.style.setProperty("--scene-tilt-x", "0deg");
      scene.style.setProperty("--scene-tilt-y", "0deg");
      scene.style.setProperty("--scene-light-x", "50%");
      scene.style.setProperty("--scene-light-y", "50%");
    });
  }
}

function initializeSiteIntro() {
  const loadingScreen = document.querySelector(".site-loading-screen");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!loadingScreen || reduceMotion) return;

  document.body.classList.add("site-intro-active");

  let pageLoaded = document.readyState === "complete";
  let minimumElapsed = false;
  let isDismissed = false;

  const dismiss = () => {
    if (!isDismissed && pageLoaded && minimumElapsed) {
      isDismissed = true;
      document.body.classList.remove("site-intro-active");
      document.body.classList.add("site-revealed");
    }
  };

  window.addEventListener("load", () => {
    pageLoaded = true;
    dismiss();
  }, { once: true });

  window.setTimeout(() => {
    minimumElapsed = true;
    dismiss();
  }, 1100);

  window.setTimeout(() => {
    pageLoaded = true;
    minimumElapsed = true;
    dismiss();
  }, 2800);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMobileNavigation, { once: true });
} else {
  initializeMobileNavigation();
}
