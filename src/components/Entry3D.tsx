import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Entry3DProps {
  onEnter: () => void;
}

export const Entry3D: React.FC<Entry3DProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredSnowflakeIndex, setHoveredSnowflakeIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- Three.js Setup ---
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0A0A0A');
    scene.fog = new THREE.FogExp2('#0A0A0A', 0.02);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 0, 9); // Start position

    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Load immediately - zero delay

    // --- Lights & Specular Swipes ---
    const ambientLight = new THREE.AmbientLight('#202020', 0.5);
    scene.add(ambientLight);

    // Orbiting light to swipe across diamond ice crystals
    const pointLight = new THREE.PointLight('#ffffff', 2.0, 30);
    pointLight.position.set(5, 5, 8);
    scene.add(pointLight);

    const directionalLight1 = new THREE.DirectionalLight('#e5e5e5', 1.5);
    directionalLight1.position.set(-8, 8, 4);
    scene.add(directionalLight1);

    const goldSpecularLight = new THREE.DirectionalLight('#c0c0c0', 1.0);
    goldSpecularLight.position.set(8, -8, 2);
    scene.add(goldSpecularLight);

    // --- 3D Geometric Diamond Snowflake Construction ---
    // Instantiated once, shared across all cloned instances
    const armGeo = new THREE.BoxGeometry(1.6, 0.035, 0.035);
    const branchGeo = new THREE.BoxGeometry(0.4, 0.025, 0.025);

    // Breathtaking Glass/Ice Refraction Material
    const iceMaterial = isMobile 
      ? new THREE.MeshStandardMaterial({
          color: '#e5e5e5',
          roughness: 0.2,
          metalness: 0.8,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshPhysicalMaterial({
          color: '#e5e5e5',
          roughness: 0.08,
          metalness: 0.95,
          transparent: true,
          opacity: 0.8,
          transmission: 0.7,
          thickness: 0.6,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          side: THREE.DoubleSide,
        });

    const masterSnowflake = new THREE.Group();

    // 3 main axes intersecting at 60-degree angles
    for (let j = 0; j < 3; j++) {
      const arm = new THREE.Mesh(armGeo, iceMaterial);
      arm.rotation.z = (j * Math.PI) / 3;
      masterSnowflake.add(arm);
    }

    // Side branches on each arm (crystalline snowflake shape)
    for (let armIdx = 0; armIdx < 6; armIdx++) {
      const armAngle = (armIdx * Math.PI) / 3;
      for (let side = -1; side <= 1; side += 2) {
        const branch = new THREE.Mesh(branchGeo, iceMaterial);
        const dist = 0.5;
        branch.position.set(Math.cos(armAngle) * dist, Math.sin(armAngle) * dist, 0);
        branch.rotation.z = armAngle + (side * Math.PI) / 6;
        masterSnowflake.add(branch);
      }
    }

    // --- Instantiate Swarm of 3D Snowflakes ---
    const snowflakesGroup = new THREE.Group();
    scene.add(snowflakesGroup);

    const snowflakeCount = isMobile ? 35 : 75;
    const snowflakes: THREE.Group[] = [];
    const intersectableMeshes: THREE.Object3D[] = [];

    const baseXPositions: number[] = [];
    const baseYPositions: number[] = [];
    const baseZPositions: number[] = [];
    const baseRotationsX: number[] = [];
    const baseRotationsY: number[] = [];

    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = masterSnowflake.clone();

      // Distribute in a beautiful spiral depth tunnel
      const angle = (i / snowflakeCount) * Math.PI * 2 * 2;
      const z = -18 + (i / snowflakeCount) * 26; // Distributed along Z
      const x = Math.cos(angle) * (5.5 + Math.random() * 0.5);
      const y = Math.sin(angle) * (4.2 + Math.random() * 0.5);

      snowflake.position.set(x, y, z);

      // Random scale and tilt
      const scale = Math.random() * 0.9 + 0.4;
      snowflake.scale.set(scale, scale, scale);
      
      snowflake.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      snowflake.userData = { index: i, baseScale: scale };
      snowflakesGroup.add(snowflake);
      snowflakes.push(snowflake);

      // Save baseline coordinates
      baseXPositions.push(x);
      baseYPositions.push(y);
      baseZPositions.push(z);
      baseRotationsX.push(snowflake.rotation.x);
      baseRotationsY.push(snowflake.rotation.y);

      // Associate child meshes for raycasting
      snowflake.children.forEach((child) => {
        child.userData = { parentIndex: i };
        intersectableMeshes.push(child);
      });
    }

    // --- Programmatic Canvas-Generated Bokeh Particles ---
    const createBokehTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        gradient.addColorStop(0.3, 'rgba(203, 213, 225, 0.22)'); // Sleek platinum-silver halo
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const bokehGeometry = new THREE.BufferGeometry();
    const bokehCount = isMobile ? 15 : 45;
    const bokehPositions = new Float32Array(bokehCount * 3);
    const bokehSpeeds = new Float32Array(bokehCount);
    const bokehDrift = new Float32Array(bokehCount);

    for (let i = 0; i < bokehCount * 3; i += 3) {
      bokehPositions[i] = (Math.random() - 0.5) * 16;
      bokehPositions[i + 1] = (Math.random() - 0.5) * 12;
      bokehPositions[i + 2] = Math.random() * 15 - 5;
      bokehSpeeds[i / 3] = Math.random() * 0.016 + 0.006;
      bokehDrift[i / 3] = Math.random() * 0.005 + 0.002;
    }

    bokehGeometry.setAttribute('position', new THREE.BufferAttribute(bokehPositions, 3));

    const bokehMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      map: createBokehTexture(),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const bokehParticles = new THREE.Points(bokehGeometry, bokehMaterial);
    scene.add(bokehParticles);

    // --- Standard Snow Dust ---
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = isMobile ? 120 : 350;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeeds = new Float32Array(dustCount);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 25;
      dustPositions[i + 1] = (Math.random() - 0.5) * 18;
      dustPositions[i + 2] = (Math.random() - 0.5) * 40;
      dustSpeeds[i / 3] = Math.random() * 0.035 + 0.012;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0xe8f0f5,
      size: 0.07,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // --- Interactive Mouse Raycaster ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- Resize handler ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let warpFactor = 0; // Cinematic warp speed state

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Spotlight orbit animation to sweep shiny metal highlights
      pointLight.position.x = Math.sin(elapsedTime * 0.8) * 12;
      pointLight.position.y = Math.cos(elapsedTime * 0.6) * 10;
      pointLight.position.z = 6 + Math.sin(elapsedTime * 0.4) * 4;

      // 1. Dynamic Camera Parallax: camera moves and tilts to follow mouse
      if (!isEntering) {
        const targetCamX = mouse.x * 2.8;
        const targetCamY = mouse.y * 2.2;
        camera.position.x += (targetCamX - camera.position.x) * 0.045;
        camera.position.y += (targetCamY - camera.position.y) * 0.045;
        camera.lookAt(0, 0, -4);
      }

      // Check current hovered snowflake parent group
      let hoveredIndex = -1;
      if (!isEntering) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(intersectableMeshes);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          hoveredIndex = hitMesh.userData.parentIndex;
        }
      }

      // React hook status updater
      if (hoveredIndex !== hoveredSnowflakeIndex) {
        setHoveredSnowflakeIndex(hoveredIndex === -1 ? null : hoveredIndex);
      }

      // 2. Cinematic Entrance Warp Factor LERP
      if (isEntering) {
        warpFactor += (1.0 - warpFactor) * 0.038;
      }

      // 3. Snowflakes movement & interactive physics calculations
      snowflakes.forEach((snowflake, index) => {
        const isHovered = index === hoveredIndex;
        const baseScale = snowflake.userData.baseScale;

        // Base coordinates
        const baseX = baseXPositions[index];
        const baseY = baseYPositions[index];
        const baseZ = baseZPositions[index];

        if (isEntering) {
          // WARP PORTAL VORTEX EFFECT:
          // Spin fast in spiral orbits and collapse in a fashion wormhole
          snowflake.rotation.x += 0.05 * (1.0 + warpFactor * 3);
          snowflake.rotation.y += 0.05 * (1.0 + warpFactor * 3);
          snowflake.rotation.z += 0.08 * (1.0 + warpFactor * 3);
          
          const currentRadius = Math.sqrt(baseX * baseX + baseY * baseY) * (1.0 - warpFactor * 0.9);
          const angle = Math.atan2(baseY, baseX) + warpFactor * elapsedTime * 4.0;

          snowflake.position.x += (Math.cos(angle) * currentRadius - snowflake.position.x) * 0.08;
          snowflake.position.y += (Math.sin(angle) * currentRadius - snowflake.position.y) * 0.08;
          snowflake.position.z += ((baseZ - warpFactor * 16.0) - snowflake.position.z) * 0.08;

          snowflake.scale.x += (0.1 - snowflake.scale.x) * 0.05;
          snowflake.scale.y += (0.1 - snowflake.scale.y) * 0.05;
          snowflake.scale.z += (0.1 - snowflake.scale.z) * 0.05;
        } 
        else if (isHovered) {
          // Hover State: Pop out closer to lens, grow 35%, tilt to face cursor
          const targetScale = baseScale * 1.35;
          snowflake.scale.x += (targetScale - snowflake.scale.x) * 0.15;
          snowflake.scale.y += (targetScale - snowflake.scale.y) * 0.15;
          snowflake.scale.z += (targetScale - snowflake.scale.z) * 0.15;

          // Orbit spin slightly faster
          snowflake.rotation.x += 0.025;
          snowflake.rotation.y += 0.025;
          snowflake.rotation.z += 0.015;

          const targetRotX = baseRotationsX[index] - mouse.y * 0.5;
          const targetRotY = baseRotationsY[index] + mouse.x * 0.5;
          snowflake.rotation.x += (targetRotX - snowflake.rotation.x) * 0.12;
          snowflake.rotation.y += (targetRotY - snowflake.rotation.y) * 0.12;

          const targetX = baseX + mouse.x * 0.7;
          const targetY = baseY + mouse.y * 0.7;
          const targetZ = baseZ + 2.0; // Pop forward significantly!

          snowflake.position.x += (targetX - snowflake.position.x) * 0.12;
          snowflake.position.y += (targetY - snowflake.position.y) * 0.12;
          snowflake.position.z += (targetZ - snowflake.position.z) * 0.12;
        } 
        else {
          // Default State: Float gently and return to base spiral
          snowflake.scale.x += (baseScale - snowflake.scale.x) * 0.1;
          snowflake.scale.y += (baseScale - snowflake.scale.y) * 0.1;
          snowflake.scale.z += (baseScale - snowflake.scale.z) * 0.1;

          // Slow elegant continuous rotation
          snowflake.rotation.x += 0.005;
          snowflake.rotation.y += 0.006;
          snowflake.rotation.z += 0.003;

          // FLOCKING SHOCKWAVE:
          // Pushed away physically if another snowflake is hovered
          let flockOffsetX = 0;
          let flockOffsetY = 0;

          if (hoveredIndex !== -1) {
            const hoveredGroup = snowflakes[hoveredIndex];
            const dx = baseX - hoveredGroup.position.x;
            const dy = baseY - hoveredGroup.position.y;
            const dz = baseZ - hoveredGroup.position.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 4.8) {
              const pushForce = (4.8 - dist) * 0.18;
              flockOffsetX = (dx / dist) * pushForce;
              flockOffsetY = (dy / dist) * pushForce;
            }
          }

          const waveY = baseY + Math.sin(elapsedTime * 0.5 + index) * 0.15;
          snowflake.position.x += (baseX + flockOffsetX - snowflake.position.x) * 0.07;
          snowflake.position.y += (waveY + flockOffsetY - snowflake.position.y) * 0.07;
          snowflake.position.z += (baseZ - snowflake.position.z) * 0.07;
        }
      });

      // 4. Large Out-of-Focus Bokeh Snow falling loop
      const bokehPosAttr = bokehGeometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < bokehCount; i++) {
        let y = bokehPosAttr.getY(i);
        let x = bokehPosAttr.getX(i);

        y -= bokehSpeeds[i];
        x += Math.sin(elapsedTime * 0.4 + i) * bokehDrift[i];

        if (y < -6) {
          y = 6;
          x = (Math.random() - 0.5) * 16;
        }

        bokehPosAttr.setY(i, y);
        bokehPosAttr.setX(i, x);
      }
      bokehPosAttr.needsUpdate = true;

      // 5. Far crisp snow falling loop
      const dustPosAttr = dustGeometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        let y = dustPosAttr.getY(i);
        let x = dustPosAttr.getX(i);

        y -= dustSpeeds[i];
        x += Math.sin(elapsedTime * 0.6 + i) * 0.002;

        if (y < -9) {
          y = 9;
          x = (Math.random() - 0.5) * 25;
        }

        dustPosAttr.setY(i, y);
        dustPosAttr.setX(i, x);
      }
      dustPosAttr.needsUpdate = true;

      // 6. Camera shoots through vortex tunnel on Click
      if (isEntering) {
        camera.position.z += (-24 - camera.position.z) * 0.12;
        camera.rotation.z += 0.015 * (1.0 + warpFactor * 4); // Twist warp rotation!

        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.density += 0.06;
        }

        if (camera.position.z < -22.5) {
          cancelAnimationFrame(animationFrameId);
          onEnter();
          return;
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean memory
      armGeo.dispose();
      branchGeo.dispose();
      iceMaterial.dispose();
      bokehGeometry.dispose();
      bokehMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    };
  }, [isEntering, onEnter]);

  return (
    <div ref={containerRef} className="entry-container">
      {/* Dynamic 3D WebGL Scene */}
      <canvas ref={canvasRef} className="entry-canvas" />

      {/* Cyber-Luxury HUD Decorative Borders & Details */}
      <div className="entry-hud">
        <div className="hud-corner top-left">
          <div className="hud-line-h" />
          <div className="hud-line-v" />
        </div>
        <div className="hud-corner top-right">
          <div className="hud-line-h" />
          <div className="hud-line-v" />
        </div>
        <div className="hud-corner bottom-left">
          <div className="hud-line-h" />
          <div className="hud-line-v" />
        </div>
        <div className="hud-corner bottom-right">
          <div className="hud-line-h" />
          <div className="hud-line-v" />
        </div>
      </div>

      {/* Entrance UI controls (fades out as warp begins) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isEntering ? { opacity: 0, scale: 0.9, y: -40 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="entry-overlay"
      >
        <motion.div 
            className="entry-content"
            animate={showPreview && window.innerWidth > 768 ? { x: -160 } : { x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            <div className="entry-title-group">
              <div className="entry-kicker">Aluguel Premium de Roupas de Neve no Chile</div>
              <h1 className="entry-title">
                Valle
                <span>Showroom</span>
              </h1>
            </div>
            <div className="entry-divider" />
            <p className="entry-tagline">Looks de neve sofisticados para viver sua experiência no Chile com estilo, conforto e praticidade.</p>
            <div className="entry-actions">
              <button className="entry-btn primary" onClick={() => setIsEntering(true)}>
                <span>Entrar no showroom</span>
              </button>
              <button className="entry-btn secondary" onClick={() => setShowPreview(true)}>
                <span>Conhecer a curadoria</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

      {/* Sliding Preview Drawer */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 140 }}
            className="entry-preview-drawer"
          >
            <div className="preview-drawer-header">
              <h2 className="preview-drawer-title">A Curadoria Valle</h2>
              <button className="preview-drawer-close" onClick={() => setShowPreview(false)}>
                Fechar ×
              </button>
            </div>
            <p className="curadoriaIntroText">
              "Na Valle Showroom, cada peça é escolhida para unir proteção, conforto e estilo. Nossa coleção reúne roupas de neve premium, macacões, conjuntos, botas e acessórios para quem quer viver a neve no Chile com praticidade e sofisticação."
            </p>
            
            <div className="preview-cards-list">
              <div className="preview-card-item">
                <div className="preview-card-img-wrapper">
                  <img src="/showroom-entry/entry_1.jpg" alt="Looks premium para neve" />
                </div>
                <div className="preview-card-info">
                  <span className="preview-card-tag">Exclusivo</span>
                  <h3 className="preview-card-title">Looks premium para neve</h3>
                  <p className="preview-card-desc">Macacões e conjuntos selecionados para garantir conforto térmico, mobilidade e presença nas fotos da sua viagem.</p>
                </div>
              </div>

              <div className="preview-card-item">
                <div className="preview-card-img-wrapper">
                  <img src="/showroom-entry/entry_3.jpg" alt="Atendimento agendado" />
                </div>
                <div className="preview-card-info">
                  <span className="preview-card-tag">Experiência</span>
                  <h3 className="preview-card-title">Atendimento agendado</h3>
                  <p className="preview-card-desc">Trabalhamos com horários reservados para que você escolha seu look com calma, sem filas e com orientação personalizada.</p>
                </div>
              </div>

              <div className="preview-card-item">
                <div className="preview-card-img-wrapper">
                  <img src="/showroom-entry/entry_5.jpg" alt="Mais de 50 modelos" />
                </div>
                <div className="preview-card-info">
                  <span className="preview-card-tag">Acervo</span>
                  <h3 className="preview-card-title">Mais de 50 modelos</h3>
                  <p className="preview-card-desc">O catálogo online apresenta uma curadoria. No showroom, você encontra mais de 50 modelos e variações de cores disponíveis.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
