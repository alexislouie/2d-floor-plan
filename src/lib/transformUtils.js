import * as THREE from 'three';
import scene from '../../static/Room2.json';

export const applyTransformation = (transform) => {
	const matrix = new THREE.Matrix4();

	matrix.fromArray(transform);

	const position = new THREE.Vector3().setFromMatrixPosition(matrix);
	const rotation = new THREE.Euler().setFromRotationMatrix(matrix);
	const scale = new THREE.Vector3().setFromMatrixPosition(matrix);

	return {
		position,
		rotation,
		scale,
	};
};

// Gets the average wall direction and computes the angle of its vector
export const getAverageDirectionXZ = () => {
	const sum = getWallDirections().reduce(
		(acc, dir) => acc.add(dir),
		new THREE.Vector3()
	);
	sum.normalize();

	// Angle in radians from world Z axis
	const angle = Math.atan2(sum.x, sum.z); // Y-axis rotation
	return angle;
};

const getWallDirections = () => {
	return scene.walls.map((wall) => {
		const matrix = new THREE.Matrix4().fromArray(wall.transform);
		const zAxis = new THREE.Vector3();
		matrix.extractBasis(new THREE.Vector3(), new THREE.Vector3(), zAxis);

		// Flatten to XZ plane
		zAxis.y = 0;
		zAxis.normalize();
		return zAxis;
	});
};
