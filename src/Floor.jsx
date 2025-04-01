import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { Html, Text } from '@react-three/drei';

const Floor = ({ floor, color }) => {
	const [width, height] = floor.dimensions;
	const floorRef = useRef();

	useEffect(() => {
		if (floorRef.current) {
			// Apply transform matrix
			const matrix = new THREE.Matrix4();
			matrix.fromArray(floor.transform);

			// Lower position along the y-axis to avoid z-fighting
			const position = new THREE.Vector3();
			const quaternion = new THREE.Quaternion();
			const scale = new THREE.Vector3();
			matrix.decompose(position, quaternion, scale);
			position.y -= 0.001;

			matrix.compose(position, quaternion, scale);

			floorRef.current.applyMatrix4(matrix);
		}
	}, [floor.transform]);

	return (
		<>
			<mesh ref={floorRef} receiveShadow>
				<planeGeometry args={[width, height]} />
				<meshStandardMaterial color={color} side={THREE.DoubleSide} />
			</mesh>
		</>
	);
};

export default Floor;
