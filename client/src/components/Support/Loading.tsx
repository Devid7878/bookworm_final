import { useEffect, useState } from 'react';
import Spinner from './images/spinner.gif';

export default function Loading() {
	return (
		<div>
			<div className='loader'>
				<img src={Spinner} alt='loader' />
			</div>
		</div>
	);
}
