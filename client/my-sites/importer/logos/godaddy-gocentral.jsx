/** @format */

/**
 * External dependencies
 */
import React from 'react';

export default function GoDaddyGoCentralLogo( {
	size,
	className = 'godaddy-gocentral social-logo importer__service-icon',
} ) {
	return (
		<img
			// eslint-disable-next-line wpcalypso/jsx-classname-namespace
			className={ className }
			width={ size }
			height={ size }
			src="/calypso/images/importer/godaddy-gocentral.png"
			alt="GoDaddy GoCentral"
		/>
	);
}
