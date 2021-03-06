// Copyright 2016 Documize Inc. <legal@documize.com>. All rights reserved.
//
// This software (Documize Community Edition) is licensed under
// GNU AGPL v3 http://www.gnu.org/licenses/agpl-3.0.en.html
//
// You can operate outside the AGPL restrictions by purchasing
// Documize Enterprise Edition and obtaining a commercial license
// by contacting <sales@documize.com>.
//
// https://documize.com

import { empty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Notifier from '../../mixins/notifier';
import Component from '@ember/component';

export default Component.extend(Notifier, {
	documentSvc: service('document'),
	docName: '',
	docExcerpt: '',
	hasNameError: empty('docName'),

	didReceiveAttrs() {
		this._super(...arguments);

		this.set('docName', this.get('document.name'));
		this.set('docExcerpt', this.get('document.excerpt'));
	},

	actions: {
		onSave() {
			if (this.get('hasNameError')) return;

			let constants = this.get('constants');

			this.set('document.name', this.get('docName'));
			this.set('document.excerpt', this.get('docExcerpt').trim());

			let lifecycle = this.get('lifecycle.selected');
			this.set('document.lifecycle', lifecycle);

			let cb = this.get('onSaveDocument');
			cb(this.get('document'));

			if (lifecycle === constants.Lifecycle.Draft) {
				this.get('activitySvc').clearChangeHistory(this.get('document.id'));
			}
		}
	}
});
