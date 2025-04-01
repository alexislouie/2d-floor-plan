import Floor from './Floor';
import Furniture from './Furniture';
import scene from '../static/Room2.json';
import Wall from './Wall';
import Opening from './Opening';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getAverageDirectionXZ } from './lib/transformUtils';
import { Html } from '@react-three/drei';
import { useControls } from 'leva';

const WALL_DEPTH = 0.1;

export default function Room({ isOrthographic }) {
	const [minPosXBoundingBox, setMinPosXBoundingBox] = useState(0);
	const [maxPosYBoundingBox, setMaxPosYBoundingBox] = useState(0);
	const [boundingBoxHeight, setBoundingBoxHeight] = useState(0);
	const [boundingBoxWidth, setBoundingBoxWidth] = useState(0);

	const controls = useControls({
		wallColor: {
			value: '#495bb1',
		},
		floorColor: {
			value: '#8ab6d5',
		},
		furnitureColor: {
			value: 'lightGreen',
		},
	});

	const minWindowHeight = scene.windows.reduce((minPosY, currentWindow) => {
		return Math.min(minPosY, currentWindow.transform[14]);
	}, Infinity);

	const groupRef = useRef();
	const meshRef = useRef();

	// Transform Mesh using a BoundingBox
	useEffect(() => {
		if (groupRef.current) {
			// Handle rotation
			if (isOrthographic) {
				const averageWallDirection = getAverageDirectionXZ();
				groupRef.current.rotation.y = -averageWallDirection + Math.PI;
			} else {
				// reset
				groupRef.current.rotation.y = 0;
			}

			// Re-center
			// TODO: update to not create this box every time
			const box = new THREE.Box3().setFromObject(groupRef.current);
			const center = new THREE.Vector3();
			box.getCenter(center);
			groupRef.current.position.sub(center);

			const min = box.min;
			const max = box.max;

			// save the minX and maxY of the bounding box of the Ortho view
			// to use as height and width measurements
			if (isOrthographic) {
				if (!boundingBoxHeight) {
					const distanceHeight = new THREE.Vector3(
						min.x,
						max.y,
						min.z
					).distanceTo(new THREE.Vector3(min.x, max.y, max.z));

					setBoundingBoxHeight(distanceHeight);
				}
				if (!boundingBoxWidth) {
					const distanceWidth = new THREE.Vector3(
						min.x,
						max.y,
						min.z
					).distanceTo(new THREE.Vector3(max.x, max.y, min.z));

					setBoundingBoxWidth(distanceWidth);
				}

				if (!minPosXBoundingBox) {
					setMinPosXBoundingBox(box.min.x);
				}
				if (!maxPosYBoundingBox) {
					setMaxPosYBoundingBox(box.max.z);
				}
			}
		}
	}, [groupRef.current, isOrthographic, boundingBoxHeight, boundingBoxWidth]);

	return (
		<>
			<mesh ref={meshRef}>
				<group ref={groupRef}>
					{scene.floors.map((floor, i) => (
						<Floor
							key={`floor-${i}`}
							floor={floor}
							color={controls.floorColor}
						/>
					))}

					{scene.objects.map((furniture, i) => (
						<Furniture
							key={`furniture-${i}`}
							furniture={furniture}
							color={controls.furnitureColor}
							isOrthographic={isOrthographic}
						/>
					))}
					{scene.walls.map((walls, i) => (
						<Wall
							key={`wall-${i}`}
							wall={walls}
							depthOverride={WALL_DEPTH}
							minWindowHeight={minWindowHeight}
							color={controls.wallColor}
						/>
					))}

					{scene.openings.map((opening, i) => (
						<Opening
							key={`opening-${i}`}
							opening={opening}
							depthOverride={WALL_DEPTH + 0.01}
							materialProps={{
								transparent: true,
							}}
							isOrthographic={isOrthographic}
						/>
					))}
					{scene.windows.map((window, i) => (
						<Opening
							key={`window-${i}`}
							opening={window}
							color="#00ffff"
							depthOverride={WALL_DEPTH + 0.01}
							isOrthographic={isOrthographic}
						/>
					))}
				</group>
			</mesh>
			{isOrthographic && (
				<>
					<Html
						position-x={boundingBoxWidth.toFixed(2) / 2}
						style={{
							transform: 'rotate(90deg)',
						}}
					>
						{boundingBoxWidth.toFixed(2)}m
					</Html>
					<Html position-z={boundingBoxHeight / 2}>
						{boundingBoxHeight.toFixed(2)}m
					</Html>
				</>
			)}
		</>
	);
}
