import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Custom GLSL Shaders for the Scrollytelling Waterfall-to-Aquifer background.
 * Implements:
 * 1. Sunlit forest canopy with soft volumetric god-rays
 * 2. Multi-speed domain-warped fBm waterfall strands accelerating downward
 * 3. Screen-space concentric plunge-pool ripples & reflections
 * 4. Subsurface cutaway showing Odisha's geological strata & groundwater table
 */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Hash & Noise Functions
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractional Brownian Motion with Domain Warping
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  float domainWarp(vec2 p, float speed) {
    vec2 q = vec2(fbm(p + vec2(0.0, uTime * speed * 0.4)),
                  fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) - vec2(0.0, uTime * speed)),
                  fbm(p + 4.0 * q + vec2(8.3, 2.8)));
    return fbm(p + 4.0 * r);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    float t = uTime;
    float scroll = clamp(uScrollProgress, 0.0, 1.0);

    // Camera Vertical Elevation mapping:
    // scroll 0.0 -> Canopy sky
    // scroll 0.35 -> Cascading waterfall face
    // scroll 0.60 -> Plunge pool
    // scroll 0.85 -> Below ground (aquifer cross-section)
    float camY = scroll * 3.0; // shifts world coordinate downwards

    vec3 finalColor = vec3(0.0);

    // -------------------------------------------------------------
    // 1. SKY & FOREST CANOPY LAYER (Visible at top: scroll 0.0 - 0.35)
    // -------------------------------------------------------------
    vec3 skyColor = mix(vec3(0.04, 0.09, 0.13), vec3(0.08, 0.22, 0.28), uv.y);
    
    // Golden God Rays from top-left sun
    vec2 sunPos = vec2(0.15 * aspect, 1.15);
    vec2 toSun = p - sunPos;
    float sunDist = length(toSun);
    float angle = atan(toSun.y, toSun.x);
    float rayNoise = noise(vec2(angle * 8.0, t * 0.15)) * noise(vec2(angle * 16.0, t * 0.08));
    float godRays = smoothstep(0.3, 0.8, rayNoise) * exp(-sunDist * 1.1) * 0.45;
    vec3 rayColor = vec3(0.95, 0.85, 0.6) * godRays;

    // Forest Sal/Teak canopy silhouettes (multiple depth planes)
    float canopy1 = smoothstep(0.48, 0.52, fbm(vec2(p.x * 2.5, 0.0) + 1.2) * 0.3 + 0.68 - (camY * 0.6));
    float canopy2 = smoothstep(0.45, 0.55, fbm(vec2(p.x * 4.0, 0.0) + 4.5) * 0.2 + 0.58 - (camY * 0.6));
    vec3 forestColor = mix(vec3(0.03, 0.08, 0.06), vec3(0.06, 0.14, 0.10), uv.y);

    vec3 sceneAbove = skyColor + rayColor;
    sceneAbove = mix(forestColor * 1.3, sceneAbove, canopy2);
    sceneAbove = mix(forestColor * 0.8, sceneAbove, canopy1);

    // -------------------------------------------------------------
    // 2. WATERFALL GORGE & CLIFF (Visible: scroll 0.15 - 0.70)
    // -------------------------------------------------------------
    // Rocky cliff backdrop with vertical mossy striations
    float rockTex = fbm(vec2(p.x * 8.0, (uv.y - camY * 0.4) * 4.0));
    vec3 rockColor = mix(vec3(0.07, 0.09, 0.10), vec3(0.13, 0.11, 0.09), rockTex);
    rockColor = mix(rockColor, vec3(0.05, 0.12, 0.08), smoothstep(0.55, 0.8, rockTex)); // moss streaks

    // Central waterfall stream: accelerates downward (thinning/stretching)
    float fallCenter = 0.5 * aspect;
    float distFromFall = abs(p.x - fallCenter);
    
    // Width of waterfall channel
    float fallWidth = 0.32 + 0.08 * sin(uv.y * 6.0 + t);
    float fallMask = smoothstep(fallWidth, fallWidth * 0.2, distFromFall);

    // Dynamic downward acceleration stretch
    float accelY = (1.0 - uv.y) * 2.5; 
    vec2 fallUvFast = vec2(p.x * 12.0, (uv.y * (1.0 + accelY) + t * 3.8));
    vec2 fallUvMid  = vec2(p.x * 8.0,  (uv.y * (1.0 + accelY) + t * 2.4));
    vec2 fallUvSlow = vec2(p.x * 4.0,  (uv.y * 1.5 + t * 1.2));

    float waterFast = domainWarp(fallUvFast, 2.5);
    float waterMid  = fbm(fallUvMid);
    float waterSlow = fbm(fallUvSlow);

    float combinedWater = (waterFast * 0.5 + waterMid * 0.35 + waterSlow * 0.15);
    
    // Foam & whitewater highlight
    float whitewater = smoothstep(0.42, 0.75, combinedWater) * fallMask;
    vec3 waterDeepColor = vec3(0.04, 0.45, 0.48); // clear mountain emerald/teal
    vec3 waterWhiteColor = vec3(0.92, 0.98, 1.0);  // crisp aeration foam
    vec3 waterFinal = mix(waterDeepColor, waterWhiteColor, whitewater);

    // Blend rock and waterfall
    vec3 gorgeScene = mix(rockColor, waterFinal, fallMask * 0.92);

    // -------------------------------------------------------------
    // 3. PLUNGE POOL & SCREEN-SPACE RIPPLES (Visible: scroll 0.40 - 0.80)
    // -------------------------------------------------------------
    float poolWaterline = 0.42 - (camY - 1.2) * 0.4;
    float isPool = smoothstep(poolWaterline + 0.02, poolWaterline - 0.02, uv.y);

    // Concentric ripple distortion from impact point
    vec2 impactPoint = vec2(fallCenter, poolWaterline);
    vec2 rippleVec = p - impactPoint;
    float rippleDist = length(rippleVec);
    float ripple = sin(rippleDist * 32.0 - t * 6.0) * exp(-rippleDist * 3.5);
    
    vec3 poolColor = mix(vec3(0.03, 0.35, 0.38), vec3(0.02, 0.18, 0.22), rippleDist);
    poolColor += vec3(0.3, 0.8, 0.85) * ripple * 0.2; // ripple crests
    
    // Blend waterfall with plunge pool
    gorgeScene = mix(gorgeScene, poolColor, isPool * 0.95);

    // -------------------------------------------------------------
    // 4. SUBSURFACE AQUIFER CROSS-SECTION (Visible: scroll 0.65 - 1.0)
    // -------------------------------------------------------------
    // Camera dips below the riverbed into Odisha geological strata:
    // Layer A: Topsoil & Alluvial sand (0.0m - 3.0m)
    // Layer B: Odisha Red Laterite clay (3.0m - 12.0m)
    // Layer C: Weathered fractured rock & Water Table Line
    // Layer D: Deep Granitic Aquifer
    float groundLevel = 0.65 - (camY - 2.0) * 0.6;
    float isSubsurface = smoothstep(groundLevel + 0.05, groundLevel - 0.05, uv.y);

    // Geological layers based on depth
    float depth = (groundLevel - uv.y) * 4.0;
    
    // Strata textures
    float strataNoise = fbm(vec2(p.x * 6.0, uv.y * 24.0));
    
    // Layer 1: Sand/Alluvium
    vec3 alluviumColor = vec3(0.24, 0.20, 0.14) + strataNoise * 0.05;
    // Layer 2: Red Laterite (characteristic of Khurda/Odisha)
    vec3 lateriteColor = vec3(0.28, 0.11, 0.08) + strataNoise * 0.04;
    // Layer 3: Fractured Bedrock
    vec3 bedrockColor  = vec3(0.09, 0.12, 0.14) + strataNoise * 0.03;
    // Layer 4: Saturated Aquifer (saturated with glowing groundwater)
    vec3 aquiferColor  = vec3(0.04, 0.16, 0.20) + vec3(0.0, 0.25, 0.3) * strataNoise;

    vec3 strataColor = alluviumColor;
    strataColor = mix(strataColor, lateriteColor, smoothstep(0.4, 1.2, depth));
    strataColor = mix(strataColor, bedrockColor,  smoothstep(1.2, 2.2, depth));
    strataColor = mix(strataColor, aquiferColor,  smoothstep(2.2, 3.2, depth));

    // Glowing Water Table Line (Phreatic Surface)
    float waterTableDepth = 1.9 + 0.06 * sin(p.x * 5.0 + t * 0.5);
    float waterTableLine = smoothstep(0.04, 0.0, abs(depth - waterTableDepth));
    vec3 waterTableGlow = vec3(0.1, 0.9, 0.8) * waterTableLine * 0.9;

    // Percolating water pathways (recharge simulation from structures above)
    float seep1 = smoothstep(0.08, 0.0, abs(p.x - 0.4 * aspect)) * smoothstep(0.0, waterTableDepth, depth);
    float seep2 = smoothstep(0.08, 0.0, abs(p.x - 0.7 * aspect)) * smoothstep(0.0, waterTableDepth, depth);
    float seepFlow = sin(depth * 18.0 - t * 4.0) * 0.5 + 0.5;
    vec3 seepageColor = vec3(0.2, 0.85, 0.9) * (seep1 + seep2) * seepFlow * 0.4;

    vec3 aquiferScene = strataColor + waterTableGlow + seepageColor;

    // -------------------------------------------------------------
    // TRANSITION BLENDS BASED ON CAMERA DESCENT PROGRESS
    // -------------------------------------------------------------
    // Blend Sky/Canopy -> Gorge
    float tCanopyToGorge = smoothstep(0.05, 0.35, scroll);
    finalColor = mix(sceneAbove, gorgeScene, tCanopyToGorge);

    // Blend Gorge -> Aquifer
    float tGorgeToAquifer = smoothstep(0.55, 0.85, scroll);
    finalColor = mix(finalColor, aquiferScene, tGorgeToAquifer * isSubsurface);

    // Vignette
    float vig = 1.0 - length(vUv - 0.5) * 0.55;
    finalColor *= clamp(vig, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function WaterfallAquiferCanvas({ scrollProgress = 0 }) {
  const canvasRef = useRef(null);
  const scrollRef = useRef(scrollProgress);

  // Keep scroll progress ref up to date
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Graceful fallback for reduced motion: render static frame without loop
      return;
    }

    // 1. Scene & Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. Full-screen shader quad
    const uniforms = {
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    scene.add(quad);

    // 3. GPU Mist & Splash Particles at Impact Zone
    const particleCount = 3500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);
    const maxLife = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spawn around the plunge pool impact zone (center-x, mid-y)
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.9;
      positions[i * 3 + 1] = -0.1 + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      // Upward buoyancy + radial drift
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = 0.004 + Math.random() * 0.012; // upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

      life[i] = Math.random();
      maxLife[i] = 0.6 + Math.random() * 0.8;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle sprite / circle point
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext("2d");
    const radGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    radGrad.addColorStop(0, "rgba(230, 250, 255, 0.9)");
    radGrad.addColorStop(0.3, "rgba(180, 235, 245, 0.5)");
    radGrad.addColorStop(1, "rgba(100, 200, 220, 0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update shader uniforms
      uniforms.uTime.value = elapsedTime;
      // Smooth lerp for scroll progress
      uniforms.uScrollProgress.value += (scrollRef.current - uniforms.uScrollProgress.value) * 0.1;

      // Update mist particles
      const currentScroll = uniforms.uScrollProgress.value;
      // Only visible during waterfall impact & plunge pool stage (0.35 to 0.75)
      const mistVisibility = Math.sin(Math.PI * Math.min(Math.max((currentScroll - 0.25) / 0.5, 0), 1));
      particleMat.opacity = mistVisibility * 0.65;

      if (mistVisibility > 0.01) {
        const posArr = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 0] += velocities[i * 3 + 0] + Math.sin(elapsedTime * 3.0 + i) * 0.001;
          posArr[i * 3 + 1] += velocities[i * 3 + 1];
          posArr[i * 3 + 2] += velocities[i * 3 + 2];

          life[i] += delta;
          if (life[i] > maxLife[i] || posArr[i * 3 + 1] > 0.6) {
            // Reset particle
            posArr[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
            posArr[i * 3 + 1] = -0.15 + (Math.random() - 0.5) * 0.15;
            posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
            life[i] = 0;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 5. Handle Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      shaderMaterial.dispose();
      particleMat.dispose();
      particleGeo.dispose();
      quad.geometry.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#071318"
      }}
    />
  );
}
