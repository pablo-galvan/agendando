'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './DisabledCouponMessage.css';

class DisabledCouponMessage extends React.Component {
	static propTypes = {
		message: PropTypes.string.isRequired,
	}

	render() {
		return (
			<div>
				<div className={s.fake}></div>
				<div className={s.button} dangerouslySetInnerHTML={{ __html: this.props.message }}></div>
			</div>
		);
	}
}

export default DisabledCouponMessage;