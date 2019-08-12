/** @format */

/**
 * Internal dependencies
 */
import config from 'config';
import {
	lang,
	login,
	magicLogin,
	magicLoginUse,
	redirectJetpack,
	redirectDefaultLocale,
} from './controller';
import { setShouldServerSideRenderLogin } from './ssr';
import { makeForcedLoggedOutLayout, redirectLoggedIn, setUpLocale } from 'controller';

export default router => {
	if ( config.isEnabled( 'login/magic-login' ) ) {
		router(
			`/log-in/link/use/${ lang }`,
			setUpLocale,
			redirectLoggedIn,
			magicLoginUse,
			makeForcedLoggedOutLayout
		);

		router(
			`/log-in/link/${ lang }`,
			setUpLocale,
			redirectLoggedIn,
			magicLogin,
			makeForcedLoggedOutLayout
		);
	}

	if ( config.isEnabled( 'login/wp-login' ) ) {
		router(
			[
				`/log-in/:twoFactorAuthType(authenticator|backup|sms|push)/${ lang }`,
				`/log-in/:flow(social-connect|private-site)/${ lang }`,
				`/log-in/:socialService(google)/callback/${ lang }`,
				`/log-in/:isJetpack(jetpack)/${ lang }`,
				`/log-in/${ lang }`,
			],
			redirectJetpack,
			redirectDefaultLocale,
			setUpLocale,
			login,
			setShouldServerSideRenderLogin,
			makeForcedLoggedOutLayout
		);
	}
};
