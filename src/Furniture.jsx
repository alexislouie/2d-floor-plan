import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Outlines } from '@react-three/drei';

const Furniture = ({ furniture, color, isOrthographic }) => {
	const [width, height, depth] = furniture.dimensions;
	const furnitureRef = useRef();

	useEffect(() => {
		if (furnitureRef.current) {
			// Apply transform matrix
			const matrix = new THREE.Matrix4();
			matrix.fromArray(furniture.transform);
			furnitureRef.current.applyMatrix4(matrix);
		}
	}, [furniture.transform]);

	return (
		<mesh ref={furnitureRef} castShadow receiveShadow>
			<boxGeometry args={[width, height, depth]} />
			<meshStandardMaterial color={color} side={THREE.DoubleSide} />
			{isOrthographic && <Outlines thickness={2} color="black" />}
		</mesh>
	);
};

export default Furniture;
