import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";

const { width, height } = Dimensions.get("window");

interface FluidBlob3DProps {
  isDarkMode?: boolean;
  style?: any;
}

const FluidBlob3D: React.FC<FluidBlob3DProps> = ({
  isDarkMode = false,
  style,
}) => {
  const [isReady, setIsReady] = useState(false);

  const onContextCreate = async (gl: any) => {
    try {
      // Initialize three.js renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor(isDarkMode ? 0x0f172a : 0xffffff, 0);

      // Create scene
      const scene = new THREE.Scene();

      // Create camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      // Create geometry for fluid blob
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);

      // Create custom material with vertex shader for fluid effect
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
          colorA: { value: new THREE.Color(isDarkMode ? 0x6366f1 : 0x8b5cf6) },
          colorB: { value: new THREE.Color(isDarkMode ? 0x8b5cf6 : 0x06b6d4) },
          alpha: { value: isDarkMode ? 0.6 : 0.8 },
        },
        vertexShader: `
          uniform float time;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          // Noise function for organic movement
          float noise(vec3 position, float frequency, float amplitude) {
            vec3 p = position * frequency;
            return amplitude * (sin(p.x) * cos(p.y) + sin(p.y) * cos(p.z) + sin(p.z) * cos(p.x));
          }
          
          void main() {
            vPosition = position;
            vNormal = normal;
            
            vec3 newPosition = position;
            
            // Add multiple noise layers for complex fluid motion
            newPosition += normal * noise(position, 2.0, 0.3) * sin(time * 0.5);
            newPosition += normal * noise(position, 4.0, 0.2) * cos(time * 0.7);
            newPosition += normal * noise(position, 8.0, 0.1) * sin(time * 1.2);
            
            // Add breathing effect
            float breathe = sin(time * 0.8) * 0.1;
            newPosition *= (1.0 + breathe);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 colorA;
          uniform vec3 colorB;
          uniform float alpha;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            // Create gradient based on position and time
            float gradient = sin(vPosition.x * 2.0 + time) * 0.5 + 0.5;
            vec3 color = mix(colorA, colorB, gradient);
            
            // Add fresnel effect for more realistic look
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);
            color = mix(color, vec3(1.0), fresnel * 0.3);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });

      // Create mesh
      const blob = new THREE.Mesh(geometry, material);
      scene.add(blob);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Animation variables
      let animationId: number;
      const clock = new THREE.Clock();

      // Render loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Update shader uniforms
        material.uniforms.time.value = elapsed;

        // Gentle rotation
        blob.rotation.x = elapsed * 0.1;
        blob.rotation.y = elapsed * 0.15;
        blob.rotation.z = elapsed * 0.05;

        // Render scene
        renderer.render(scene, camera);

        // Flush GL commands
        gl.endFrameEXP();
      };

      // Start animation
      animate();
      setIsReady(true);

      // Cleanup function
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    } catch (error) {
      // Error creating 3D context - fallback to simple view
    }
  };

  return (
    <View style={[styles.container, style]}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  glView: {
    flex: 1,
  },
});

export default FluidBlob3D;
