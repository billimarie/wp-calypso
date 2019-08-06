/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
// import ImporterLogo from 'my-sites/importer/importer-logo';
import { saveSignupStep, submitSignupStep } from 'state/signup/progress/actions';
import Button from '../../../components/button';
import Card from 'components/card';
import ImporterLogo from 'my-sites/importer/importer-logo';
import StepWrapper from '../../step-wrapper';

/**
 * Style dependencies
 */
import './style.scss';

class ImportPreview extends Component {
	static previewData = {
		wix: {
			favicon: '',
			supported: [ 'Title', 'Desription', 'Static pages', 'Media' ],
		},
		'godaddy-gocentral': {
			favicon: '',
			supported: [ 'Title', 'Description' ],
		},
	};

	componentDidMount() {
		this.props.saveSignupStep( { stepName: this.props.stepName } );
	}

	submitImportPreview() {
		this.props.submitSignupStep( { stepName: this.props.stepName } );
		this.props.goToNextStep();
	}

	renderIcon() {
		const {
			signupDependencies: { importSiteEngine },
		} = this.props;

		return (
			<ImporterLogo
				icon={ importSiteEngine }
				className={
					'icon_' + importSiteEngine + ' import-preview__icon' + ' importer__service-icon'
				}
			/>
		);
	}

	renderPreview() {
		const {
			signupDependencies: { importSiteUrl, siteTitle },
			translate,
		} = this.props;

		return (
			<Card className="import-preview__card">
				<header className="import-preview__header">
					{ this.renderIcon() }
					<div className="import-preview__header-text">
						<h2 className="import-preview__title">{ siteTitle }</h2>
						<p className="import-preview__url">{ importSiteUrl }</p>
					</div>
				</header>
				<p className="import-preview__description">
					{ translate(
						"If you don't share credentials with Jetpack, your site won't be backed up. Our " +
							'support staff is available to answer any questions you might have.'
					) }
				</p>
				<Button primary onClick={ this.submitImportPreview }>
					{ translate( 'Continue' ) }
				</Button>
			</Card>
		);
	}

	render() {
		const {
			signupDependencies: { importSiteEngine },
			flowName,
			positionInFlow,
			stepName,
			translate,
		} = this.props;

		let headerText = translate( "We're working on adding new importers!" );
		let subHeaderText = translate( 'For now, we recommend you make a new website' );
		let stepContent = <p>{ translate( 'Build a new homepage' ) }</p>;

		if ( importSiteEngine ) {
			headerText = translate( 'We found your existing content.' );
			subHeaderText = translate( "We'll take this content and add it to your new WordPress site." );
			stepContent = this.renderPreview();
		}

		return (
			<StepWrapper
				flowName={ flowName }
				stepName={ stepName }
				positionInFlow={ positionInFlow }
				headerText={ headerText }
				fallbackHeaderText={ headerText }
				subHeaderText={ subHeaderText }
				fallbackSubHeaderText={ subHeaderText }
				stepContent={ stepContent }
			/>
		);
	}
}

export default connect(
	null,
	{
		saveSignupStep,
		submitSignupStep,
	}
)( localize( ImportPreview ) );
