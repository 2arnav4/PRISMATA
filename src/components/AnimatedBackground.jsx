import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const AnimatedBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-20 animated-gradient opacity-20" />
      
      {/* Overlay for better readability */}
      <div className="fixed inset-0 -z-10 bg-background/50 backdrop-blur-sm" />
      
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -15
          },
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: ['#2E4C8B', '#8B5CF6', '#14B8A6']
            },
            shape: {
              type: 'circle'
            },
            opacity: {
              value: 0.3,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
                sync: false
              }
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              outModes: {
                default: 'bounce'
              },
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detectsOn: 'canvas',
            events: {
              onHover: {
                enable: true,
                mode: 'grab'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 100,
                links: {
                  opacity: 0.5
                }
              }
            }
          },
          background: {
            color: 'transparent'
          }
        }}
      />
    </>
  );
};

export default AnimatedBackground;