/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import styles from './PhotoSlider.module.css';
import Arrow from '../../ui/icons/arrow/Arrow';
import useMediaQuery from '../../hooks/useMediaQuery';
import { IItem } from '../../utils/types';

interface IPhotoSlider {
	item: IItem;
}

export default function PhotoSlider({ item }: IPhotoSlider) {
	const [images, setImages] = useState<string[]>([]);
	const [slide, setSlide] = useState(0);
	const matches = useMediaQuery('(min-width: 768px)');
	const changeSlide = (direction = 1) => {
		let slideNumber = 0;
		if (slide + direction < 0) {
			slideNumber = images.length - 1;
		} else {
			slideNumber = (slide + direction) % images.length;
		}
		setSlide(slideNumber);
	};

	useEffect(() => {
		setImages([item.image]);
		if (item.galleryImage1) {
			setImages((img) => [...img, item.galleryImage1]);
		}
		if (item.galleryImage2) {
			setImages((img) => [...img, item.galleryImage2]);
		}
		if (item.galleryImage3) {
			setImages((img) => [...img, item.galleryImage3]);
		}
	}, [item.galleryImage1, item.galleryImage2, item.galleryImage3, item.image]);

	return (
		<div
			className={styles.slider__wrapper}
			style={{ width: matches ? '600px' : '300px' }}
		>
			{slide !== 0 ? (
				<span className={styles.btn_prev}>
					<Arrow onClick={() => changeSlide(-1)} />
				</span>
			) : (
				<span className={styles.btn_prev}>
					<Arrow />
				</span>
			)}
			{slide !== images.length - 1 ? (
				<span className={styles.btn_next}>
					<Arrow
						onClick={() => {
							changeSlide(1);
						}}
					/>
				</span>
			) : (
				<span className={styles.btn_next}>
					<Arrow />
				</span>
			)}
			<div className={styles.dots}>
				{images.map((_, i) => (
					<span
						key={i}
						className={
							i === slide
								? `${styles.dot} ${styles.dot_active}`
								: `${styles.dot} ${styles.dot_default}`
						}
					/>
				))}
			</div>

			<div className={styles.container}>
				<div
					className={styles.track}
					style={{ transform: `translateX(-${slide * 100}%)` }}
				>
					{images.map((option, i) => (
						<img
							key={i}
							src={option}
							alt={option}
							className={styles.images}
							style={{ width: matches ? '600px' : '300px' }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
