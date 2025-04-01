import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import Room from './Room';

export default function Experience({ isOrthographic }) {
	const { camera } = useThree();

	useEffect(() => {
		if (isOrthographic) {
			camera.position.set(0, 10, 0);
		} else {
			camera.position.set(0, 5, 6);
		}
		camera.updateProjectionMatrix();
	}, [isOrthographic, camera]);

	return (
		<>
			<OrbitControls enabled />
			<directionalLight position={[1, 2, 3]} intensity={4.5} />
			<ambientLight intensity={1.5} />
			<orthographicCamera />
			<perspectiveCamera />

			<Room isOrthographic={isOrthographic} />
		</>
	);
}
