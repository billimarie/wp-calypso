/** @format */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import GoDaddyGoCentralLogo from './logos/godaddy-gocentral';
import WixLogo from './logos/wix';
import MediumLogo from './logos/medium';
import SocialLogo from 'components/social-logo';

/**
 * Style dependencies
 */
import './importer-logo.scss';

const ImporterLogo = ( { icon, className = 'importer__service-icon' } ) => {
	/* eslint-disable wpcalypso/jsx-classname-namespace */

	if ( 'blogger' === icon ) {
		icon = 'blogger-alt';
	}

	if ( includes( [ 'wordpress', 'blogger-alt', 'squarespace' ], icon ) ) {
		return <SocialLogo className={ className } icon={ icon } size={ 48 } />;
	}

	if ( 'wix' === icon ) {
		return <WixLogo className={ className } />;
	}

	if ( 'godaddy-gocentral' === icon ) {
		return <GoDaddyGoCentralLogo size={ 48 } className={ className } />;
	}

	if ( 'medium' === icon ) {
		return <MediumLogo className={ className } />;
	}

	return <svg className={ className } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" />;

	/* eslint-enable wpcalypso/jsx-classname-namespace */
};

ImporterLogo.propTypes = {
	icon: PropTypes.string,
	className: PropTypes.string,
};

export default ImporterLogo;
