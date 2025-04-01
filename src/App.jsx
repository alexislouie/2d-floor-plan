import './style.css';
import ReactDOM from 'react-dom/client';
import Experience from './Experience';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';

const root = ReactDOM.createRoot(document.querySelector('#root'));

const App = () => {
	const [isOrthographic, setIsOrthographic] = useState(false);
	const saveFloorPlan = () => {
		var link = document.createElement('a');
		link.download = 'filename.png';
		link.href = document.getElementByTagName('canvas').toDataURL('image/jpeg');
		link.click();
	};

	return (
		<>
			<button
				onClick={() => setIsOrthographic((prev) => !prev)}
				style={{
					position: 'absolute',
					top: '10px',
					left: '10px',
					zIndex: 100,
				}}
			>
				{isOrthographic ? 'View Dollhouse' : 'View Floor Plan'}
			</button>
			<Canvas
				orthographic={true}
				camera={{
					near: 0.1,
					far: 200,
					fov: 45,
					zoom: 75,
					position: [0, 5, 6],
				}}
			>
				<Experience isOrthographic={isOrthographic} />
			</Canvas>
		</>
	);
};

root.render(<App />);
