import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function LotteryParticles() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
background: {
  color: {
    value: "radial-gradient(circle at center, #0a0e1a 0%, #050510 100%)"
  }
},
        fpsLimit: 120, // Increased FPS limit
        particles: {
          color: { 
            value: ["#FFD700", "#FF4444", "#4CAF50", "#FFFFFF"]
          },
          move: {
            enable: true,
            speed: 6, // Increased speed
            direction: "none", // Random directions
            outModes: "bounce", // Bounce instead of destroy
            random: true, // Add random movement
            straight: false,
            trail: {
                enable: true,
                length: 15,
                fillColor: "#000000" // ← THIS is the problem.
              }
              
          },
          number: {
            value: 80, // Increased particle count
            density: { enable: true, area: 800 }
          },
          opacity: {
            value: { min: 0.8, max: 1 }, // Less transparency
            animation: {
              enable: false // Disable opacity animation
            }
          },
          rotate: {
            animation: {
              enable: true,
              speed: 50, // Faster rotation
              sync: false
            }
          },
          shape: {
            type: "image",
            options: {
              image: [
                { src: "/bagsol.png", width: 64, height: 64 }, 
                { src: "/case.png", width: 64, height: 64 },    
                { src: "/sol.png", width: 64, height: 64 }, 
                { src: "/solstack.png", width: 64, height: 64 }, 
              ]
            }
          },
          size: {
            value: { min: 12, max: 36 }, // Larger sizes
            animation: {
              enable: true,
              speed: 10, // Faster size animation
              minimumValue: 20
            }
          },
          wobble: {
            enable: true,
            speed: 15 // Faster wobble
          },
          life: {
            duration: {
              sync: false,
              value: 0 // Particles stay forever
            }
          }
        },
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "repulse", // More engaging interaction
              count: 20
            },
            onHover: {
              enable: true,
              mode: "bubble",
              distance: 100
            }
          },
          modes: {
            repulse: { 
              distance: 150, 
              duration: 0.2,
              speed: 30 
            },
            bubble: {
              distance: 100,
              size: 40,
              duration: 2,
              opacity: 0.8
            }
          }
        },
        emitters: {
          direction: "none", // Remove directional flow
          position: { 
            x: 50, 
            y: 50 
          },
          rate: { 
            delay: 0,
            quantity: 10 // Continuous emission
          },
          size: {
            width: 0,
            height: 0
          }
        },
        detectRetina: true
      }}
    />
  );
}