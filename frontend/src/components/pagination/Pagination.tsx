/* eslint-disable react/no-array-index-key */
import { Dispatch, SetStateAction, useState } from 'react';
import ButtonPagination from '../../ui/buttonPagination/ButtonPagination';

interface IPagination {
	total: number;
	resultPerPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	currentPage: number;
}

export default function Pagination({
	total,
	resultPerPage,
	setCurrentPage,
	currentPage,
}: IPagination) {
	const steps = total ? Math.ceil(total / resultPerPage) : 0;
	const [isActive] = useState(false);
	const renderedSteps = new Array(steps)
		.fill(0)
		.map((_, index) => (
			<ButtonPagination
				key={index}
				onClick={() => setCurrentPage(index + 1)}
				text={`${index + 1}`}
				isActive={isActive === (index + 1 === currentPage)}
			/>
		));

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{renderedSteps}</>;
}
