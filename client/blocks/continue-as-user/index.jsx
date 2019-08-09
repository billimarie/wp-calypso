/**
 * External dependencies
 */
import React from 'react';
import { useTranslate } from 'i18n-calypso';

/**
 * Style dependencies
 */
import './style.scss';

export default function ContinueAsUser( { userName, redirectUrl } ) {
	const translate = useTranslate();

	if ( ! userName || ! redirectUrl ) {
		return null;
	}

	const redirectLink = <a href={ redirectUrl }>{ userName }</a>;

	return (
		<div className="continue-as-user">
			{ translate( 'or continue as {{redirectLink/}}', {
				components: { redirectLink },
				context:
					'Alternative link under login/site-selection header, skips login to continue as current user.',
			} ) }
		</div>
	);
}
