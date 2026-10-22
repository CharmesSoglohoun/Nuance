"use client";

// Mannequin 3D stylisé de Nuance, construit entièrement en code (three.js via React Three Fiber).
// Formes douces, sans visage détaillé (comme dans le design). Il s'adapte à :
//  - la taille et la silhouette (largeur des épaules, de la taille, des hanches) ;
//  - le teint (couleur de la peau) ;
//  - la tenue : haut ou robe, pantalon / jupe / short, chaussures, manteau ouvert, écharpe, bonnet.
// Unités : mètres, pour une personne de 1,75 m, puis mise à l'échelle selon la taille.

import { Children, cloneElement, isValidElement, useEffect, useMemo, type ReactElement, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Look } from "./Mannequin2D";

// Silhouettes : [épaules, taille, hanches] (mêmes valeurs que les dessins du test).
const FORMES: Record<string, [number, number, number]> = {
  sablier: [11, 6, 11], triangle: [8, 7, 13], "triangle-inv": [13, 8, 8], rectangle: [10, 9, 10], ovale: [10, 13, 10], trapeze: [13, 10, 10],
};

type Props = { look: Look; silhouette?: string; tailleCm?: number; hauteur?: number };

export function Mannequin3D({ look, silhouette = "rectangle", tailleCm = 170, hauteur = 360, repli }: Props & { repli?: ReactNode }) {
  const echelle = Math.min(Math.max(tailleCm, 140), 210) / 175;
  return (
    <div style={{ height: hauteur, width: "100%", touchAction: "pan-y" }}>
      <Canvas
        flat // pas d'effet « cinéma » sur les couleurs : les vêtements gardent les couleurs exactes de la palette
        dpr={[1, 2]}
        // Caméra assez loin pour voir le corps entier, quelle que soit la taille.
        camera={{ position: [0, 0.95 * echelle, 4.4 * echelle], fov: 30 }}
        fallback={repli}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Éclairage doux et généreux : les peaux foncées restent lumineuses et détaillées */}
        <hemisphereLight args={["#ffffff", "#e8d8c4", 1.4]} />
        <directionalLight position={[1.6, 2.6, 2.4]} intensity={1.7} />
        <directionalLight position={[-2, 1.4, 1]} intensity={0.7} color="#fff3e6" />
        <directionalLight position={[0, 1.6, -2.5]} intensity={0.6} />
        <group scale={echelle}>
          <Corps look={look} silhouette={silhouette} />
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <circleGeometry args={[0.45, 48]} />
          <meshBasicMaterial color="#2b1d14" transparent opacity={0.08} />
        </mesh>
        <OrbitControls
          target={[0, 0.88 * echelle, 0]}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
          rotateSpeed={0.9}
        />
      </Canvas>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

function Corps({ look, silhouette }: { look: Look; silhouette: string }) {
  const [s, w, h] = FORMES[silhouette] ?? FORMES.rectangle;
  const femme = look.g === "f";
  const rS = 0.012 * s + (femme ? 0.02 : 0.04); // demi-largeur des épaules
  const rW = 0.011 * w + 0.04; // taille
  const rH = 0.011 * h + (femme ? 0.06 : 0.045); // hanches
  const prof = 0.62; // profondeur du buste par rapport à sa largeur

  const peau = look.skin ?? "#6B3E24";
  const has = (c?: string) => Boolean(c) && c !== "none";

  // Profil du buste (rayon, hauteur), de bas en haut, tourné autour de l'axe vertical.
  const buste = useMemo(
    () => [v(rH * 0.92, 0.86), v(rH, 0.95), v(rW, 1.1), v(rS * 0.84, 1.28), v(rS * 0.8, 1.4), v(0.07, 1.47), v(0.001, 1.475)],
    [rS, rW, rH],
  );

  const xBras = rS + 0.005;
  const xJambe = rH * 0.48;

  const haut = look.top ?? "#2F5D45";
  const bas = look.bottom ?? "#C19A6B";
  const typeBas = look.bottomType ?? "pantalon";

  return (
    <group>
      {/* ---------- Corps (peau) ---------- */}
      <Forme couleur={peau} peau>
        <mesh position={[0, 1.63, 0]} scale={[0.92, 1.12, 0.98]}>
          <sphereGeometry args={[0.1, 32, 24]} />
        </mesh>
        <mesh position={[0, 1.51, 0]}>
          <cylinderGeometry args={[0.042, 0.046, 0.12, 20]} />
        </mesh>
        <mesh scale={[1, 1, prof]}>
          <latheGeometry args={[buste, 40]} />
        </mesh>
        {[-1, 1].map((c) => (
          <group key={c}>
            <mesh position={[c * (rS - 0.03), 1.4, 0]}>
              <sphereGeometry args={[0.055, 20, 16]} />
            </mesh>
            <mesh position={[c * xBras, 1.1, 0]} rotation={[0, 0, c * 0.07]}>
              <capsuleGeometry args={[0.037, 0.52, 8, 16]} />
            </mesh>
            <mesh position={[c * (xBras + 0.02), 0.8, 0.005]}>
              <sphereGeometry args={[0.04, 16, 12]} />
            </mesh>
            <mesh position={[c * xJambe, 0.47, 0]}>
              <capsuleGeometry args={[0.058, 0.74, 8, 16]} />
            </mesh>
          </group>
        ))}
      </Forme>

      {/* ---------- Cheveux ---------- */}
      <Cheveux style={look.hairStyle ?? "court"} couleur={look.hair ?? "#1E140E"} />

      {/* ---------- Haut ou robe ---------- */}
      <Forme couleur={haut}>
        <mesh scale={[1.07, 1, prof * 1.1]}>
          <latheGeometry args={[[v(rH * 0.98, 0.9), ...buste.slice(1, 5), v(0.085, 1.47), v(0.07, 1.48)], 40]} />
        </mesh>
        {/* Épaules couvertes par le haut (sauf haut sans manches) */}
        {look.sleeve !== "aucune" &&
          [-1, 1].map((c) => (
            <mesh key={`epaule${c}`} position={[c * (rS - 0.03), 1.4, 0]}>
              <sphereGeometry args={[0.064, 20, 16]} />
            </mesh>
          ))}
        {[-1, 1].map((c) =>
          look.sleeve === "court" ? (
            <mesh key={c} position={[c * (xBras + 0.003), 1.32, 0]} rotation={[0, 0, c * 0.12]}>
              <capsuleGeometry args={[0.05, 0.1, 8, 16]} />
            </mesh>
          ) : look.sleeve === "aucune" ? null : (
            <mesh key={c} position={[c * xBras, 1.12, 0]} rotation={[0, 0, c * 0.07]}>
              <capsuleGeometry args={[0.046, 0.48, 8, 16]} />
            </mesh>
          ),
        )}
        {look.col === "roule" && (
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.055, 0.06, 0.09, 24]} />
          </mesh>
        )}
      </Forme>

      {/* ---------- Bas ---------- */}
      <Forme couleur={bas}>
        {typeBas === "jupe" ? (
          <mesh scale={[1, 1, 0.78]}>
            <latheGeometry args={[[v(rH * 1.45, 0.42), v(rH * 1.12, 0.8), v(rH * 1.05, 0.95), v(rW * 1.1, 1.06), v(rW * 1.05, 1.08)], 40]} />
          </mesh>
        ) : (
          <>
            <mesh scale={[1, 1, prof * 1.15]}>
              {/* Le haut du pantalon reste caché sous le haut (haut porté par-dessus) */}
              <latheGeometry args={[[v(rH * 0.82, 0.78), v(rH * 0.98, 0.93), v(rH * 0.9, 0.96)], 40]} />
            </mesh>
            {[-1, 1].map((c) =>
              typeBas === "short" ? (
                <mesh key={c} position={[c * xJambe, 0.74, 0]}>
                  <capsuleGeometry args={[0.072, 0.16, 8, 16]} />
                </mesh>
              ) : (
                <mesh key={c} position={[c * xJambe, 0.5, 0]}>
                  <capsuleGeometry args={[0.068, 0.8, 8, 16]} />
                </mesh>
              ),
            )}
          </>
        )}
      </Forme>

      {/* ---------- Chaussures ---------- */}
      <Forme couleur={look.shoes ?? "#4A2E1E"}>
        {[-1, 1].map((c) => (
          <mesh key={c} position={[c * xJambe, 0.05, 0.035]} rotation={[Math.PI / 2, 0, 0]} scale={[1.05, 1, 0.75]}>
            <capsuleGeometry args={[0.05, 0.12, 8, 16]} />
          </mesh>
        ))}
      </Forme>

      {/* ---------- Manteau ou veste (ouvert devant) ---------- */}
      {has(look.outer) && (
        <Forme couleur={look.outer!} doubleFace>
          <mesh scale={[1.16, 1, prof * 1.32]}>
            <latheGeometry
              args={[
                [v(rH * (look.outerLen === "long" ? 1.3 : 1.08), look.outerLen === "long" ? 0.42 : 0.8), v(rH * 1.06, 0.95), v(rW * 1.08, 1.1), v(rS * 0.86, 1.3), v(rS * 0.82, 1.41), v(0.1, 1.48)],
                40,
                0.42, // ouverture devant
                Math.PI * 2 - 0.84,
              ]}
            />
          </mesh>
          {[-1, 1].map((c) => (
            <mesh key={c} position={[c * (xBras + 0.004), 1.12, 0]} rotation={[0, 0, c * 0.07]}>
              <capsuleGeometry args={[0.056, 0.47, 8, 16]} />
            </mesh>
          ))}
          {/* Épaules du manteau, par-dessus celles du haut */}
          {[-1, 1].map((c) => (
            <mesh key={`epaule${c}`} position={[c * (rS - 0.03), 1.405, 0]}>
              <sphereGeometry args={[0.076, 20, 16]} />
            </mesh>
          ))}
        </Forme>
      )}

      {/* ---------- Écharpe ---------- */}
      {has(look.scarf) && (
        <Forme couleur={look.scarf!}>
          <mesh position={[0, 1.47, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
            <torusGeometry args={[0.07, 0.03, 12, 32]} />
          </mesh>
          <mesh position={[0.04, 1.32, 0.075]} rotation={[0.08, 0, 0]}>
            <capsuleGeometry args={[0.028, 0.24, 6, 12]} />
          </mesh>
        </Forme>
      )}

      {/* ---------- Bonnet ---------- */}
      {has(look.hat) && (
        <Forme couleur={look.hat!}>
          <mesh position={[0, 1.66, 0]}>
            <sphereGeometry args={[0.108, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, 1.665, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.035, 32]} />
          </mesh>
        </Forme>
      )}
    </group>
  );
}

function Cheveux({ style, couleur }: { style: string; couleur: string }) {
  return (
    <Forme couleur={couleur} cheveux>
      {/* Calotte qui couvre le haut et l'arrière du crâne */}
      <mesh position={[0, 1.645, -0.008]} rotation={[-0.35, 0, 0]} scale={[0.96, 1.1, 1.02]}>
        <sphereGeometry args={[0.104, 32, 16, 0, Math.PI * 2, 0, style === "raie" ? 1.35 : 1.2]} />
      </mesh>
      {style === "chignon" && (
        <mesh position={[0, 1.76, -0.07]}>
          <sphereGeometry args={[0.05, 20, 16]} />
        </mesh>
      )}
      {style === "afro" && (
        <mesh position={[0, 1.68, -0.02]} scale={[1.05, 0.95, 1]}>
          <sphereGeometry args={[0.14, 32, 24]} />
        </mesh>
      )}
    </Forme>
  );
}

// Applique un même matériau à toutes les formes enfants.
function Forme({ couleur, children, peau = false, cheveux = false, doubleFace = false }: { couleur: string; children: ReactNode; peau?: boolean; cheveux?: boolean; doubleFace?: boolean }) {
  const materiau = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(couleur),
        roughness: peau ? 0.48 : cheveux ? 0.9 : 0.72,
        metalness: 0,
        side: doubleFace ? THREE.DoubleSide : THREE.FrontSide,
      }),
    [couleur, peau, cheveux, doubleFace],
  );
  // Libère l'ancien matériau quand la couleur change (évite d'encombrer la mémoire du téléphone).
  useEffect(() => () => materiau.dispose(), [materiau]);
  return <group>{appliquer(children, materiau)}</group>;
}

// Parcourt les éléments enfants et leur donne le matériau (sans créer un matériau par forme).
function appliquer(enfants: ReactNode, materiau: THREE.Material): ReactNode {
  return Children.map(enfants, (e) => {
    if (!isValidElement(e)) return e;
    const el = e as ReactElement<{ children?: ReactNode; material?: THREE.Material }>;
    if (el.type === "mesh") return cloneElement(el, { material: materiau });
    if (el.props.children) return cloneElement(el, { children: appliquer(el.props.children, materiau) });
    return el;
  });
}

const v = (x: number, y: number) => new THREE.Vector2(x, y);
