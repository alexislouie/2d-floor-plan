import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { extend } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
// const CustomShaderMaterial = shaderMaterial(
// 	{
// 		uColor: new THREE.Color(1.0, 0.0, 0.0),
// 	},
// 	// Vertex shader
// 	`
//       uniform float uWallClamp;
//       varying float vAlpha;
//       void main() {
//         vAlpha = step(uWallClamp, uv.y);
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
// 	// Fragment shader
// 	`
//       uniform vec3 uColor;
//       varying float vAlpha;
//       void main() {

//         gl_FragColor = vec4(uColor, vAlpha);
//       }
//     `
// );
const Wall = ({ wall, depthOverride, minWindowHeight, color }) => {
	const [width, height] = wall.dimensions;
	const wallRef = useRef();

	// extend({ CustomShaderMaterial });
	useEffect(() => {
		if (wallRef.current) {
			// Apply transform matrix
			const matrix = new THREE.Matrix4();
			matrix.fromArray(wall.transform);
			wallRef.current.applyMatrix4(matrix);
		}
	}, [wall.transform]);

	return (
		<mesh ref={wallRef} castShadow receiveShadow>
			<boxGeometry args={[width, height, depthOverride]} />
			<meshStandardMaterial color={color} />
			{/* <customShaderMaterial
				uColor={new THREE.Color('green')}
				uWallClamp={minWindowHeight}
				key={CustomShaderMaterial.key}
			/> */}
		</mesh>
	);
};

export default Wall;
