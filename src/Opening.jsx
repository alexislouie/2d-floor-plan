import * as THREE from 'three';
import { useRef, useEffect } from 'react';

// Windows, doorways, and other openings
const Opening = ({
	opening,
	color,
	depthOverride,
	materialProps,
	isOrthographic,
}) => {
	const [width, height, depth] = opening.dimensions;
	const openingRef = useRef();

	useEffect(() => {
		if (openingRef.current) {
			// Apply transform matrix
			const matrix = new THREE.Matrix4();
			matrix.fromArray(opening.transform);
			openingRef.current.applyMatrix4(matrix);
		}
	}, [opening.transform]);

	return (
		<mesh ref={openingRef} castShadow receiveShadow>
			<boxGeometry
				args={[
					width,
					height,
					// height + (isOrthographic ? 2 : 0),
					depthOverride ?? depth,
				]}
			/>
			<meshStandardMaterial
				color={color}
				side={THREE.DoubleSide}
				transparent={materialProps?.transparent ?? false}
				opacity={materialProps?.opacity ?? 1}
			/>
		</mesh>
	);
};

export default Opening;
