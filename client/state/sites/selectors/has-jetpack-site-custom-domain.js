/**
 * Internal dependencies
 */
import { withoutHttp } from 'lib/url';
import getSiteDomain from './get-site-domain';
import getSiteOption from './get-site-option';
import isJetpackSite from './is-jetpack-site';

/**
 * Checks whether a Jetpack site has a custom mapped URL.
 * Returns null if the site is not known, is not a Jetpack site
 * or has an undefined value for `domain` or `unmapped_url`.
 *
 * @param {Object} state Global state tree
 * @param {Number} siteId Site ID
 * @return {?Boolean} Whether site has custom domain
 */
export default function hasJetpackSiteCustomDomain( state, siteId ) {
	if ( ! isJetpackSite( state, siteId ) ) {
		return null;
	}

	const domain = getSiteDomain( state, siteId ),
		unmappedUrl = getSiteOption( state, siteId, 'unmapped_url' );

	if ( ! domain || ! unmappedUrl ) {
		return null;
	}

	return domain !== withoutHttp( unmappedUrl );
}
