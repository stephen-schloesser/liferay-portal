define("frontend-js-metal-web@1.0.0/metal/src/html/html", ['exports', 'module', 'metal/src/core', 'metal/src/string/string'], function (exports, module, _metalSrcCore, _metalSrcStringString) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _core = _interopRequireDefault(_metalSrcCore);

	var _string = _interopRequireDefault(_metalSrcStringString);

	var html = (function () {
		function html() {
			_classCallCheck(this, html);
		}

		/**
   * HTML regex patterns.
   * @enum {RegExp}
   * @protected
   */

		_createClass(html, null, [{
			key: 'compress',

			/**
    * Minifies given HTML source by removing extra white spaces, comments and
    * other unneeded characters without breaking the content structure. As a
    * result HTML become smaller in size.
    * - Contents within <code>, <pre>, <script>, <style>, <textarea> and
    *   conditional comments tags are preserved.
    * - Comments are removed.
    * - Conditional comments are preserved.
    * - Breaking spaces are collapsed into a single space.
    * - Unneeded spaces inside tags (around = and before />) are removed.
    * - Spaces between tags are removed, even from inline-block elements.
    * - Spaces surrounding tags are removed.
    * - DOCTYPE declaration is simplified to <!DOCTYPE html>.
    * - Does not remove default attributes from <script>, <style>, <link>,
    *   <form>, <input>.
    * - Does not remove values from boolean tag attributes.
    * - Does not remove "javascript:" from in-line event handlers.
    * - Does not remove http:// and https:// protocols.
    * @param {string} htmlString Input HTML to be compressed.
    * @return {string} Compressed version of the HTML.
    */
			value: function compress(htmlString) {
				var preserved = {};
				htmlString = html.preserveBlocks_(htmlString, preserved);
				htmlString = html.simplifyDoctype_(htmlString);
				htmlString = html.removeComments_(htmlString);
				htmlString = html.removeIntertagSpaces_(htmlString);
				htmlString = html.collapseBreakingSpaces_(htmlString);
				htmlString = html.removeSpacesInsideTags_(htmlString);
				htmlString = html.removeSurroundingSpaces_(htmlString);
				htmlString = html.returnBlocks_(htmlString, preserved);
				return htmlString.trim();
			}

			/**
    * Collapses breaking spaces into a single space.
    * @param {string} htmlString
    * @return {string}
    * @protected
    */
		}, {
			key: 'collapseBreakingSpaces_',
			value: function collapseBreakingSpaces_(htmlString) {
				return _string['default'].collapseBreakingSpaces(htmlString);
			}

			/**
    * Searches for first occurrence of the specified open tag string pattern
    * and from that point finds next ">" position, identified as possible tag
    * end position.
    * @param {string} htmlString
    * @param {string} openTag Open tag string pattern without open tag ending
    *     character, e.g. "<textarea" or "<code".
    * @return {string}
    * @protected
    */
		}, {
			key: 'lookupPossibleTagBoundary_',
			value: function lookupPossibleTagBoundary_(htmlString, openTag) {
				var tagPos = htmlString.indexOf(openTag);
				if (tagPos > -1) {
					tagPos += htmlString.substring(tagPos).indexOf('>') + 1;
				}
				return tagPos;
			}

			/**
    * Preserves contents inside any <code>, <pre>, <script>, <style>,
    * <textarea> and conditional comment tags. When preserved, original content
    * are replaced with an unique generated block id and stored into
    * `preserved` map.
    * @param {string} htmlString
    * @param {Object} preserved Object to preserve the content indexed by an
    *     unique generated block id.
    * @return {html} The preserved HTML.
    * @protected
    */
		}, {
			key: 'preserveBlocks_',
			value: function preserveBlocks_(htmlString, preserved) {
				htmlString = html.preserveOuterHtml_(htmlString, '<!--[if', '<![endif]-->', preserved);
				htmlString = html.preserveInnerHtml_(htmlString, '<code', '</code', preserved);
				htmlString = html.preserveInnerHtml_(htmlString, '<pre', '</pre', preserved);
				htmlString = html.preserveInnerHtml_(htmlString, '<script', '</script', preserved);
				htmlString = html.preserveInnerHtml_(htmlString, '<style', '</style', preserved);
				htmlString = html.preserveInnerHtml_(htmlString, '<textarea', '</textarea', preserved);
				return htmlString;
			}

			/**
    * Preserves inner contents inside the specified tag. When preserved,
    * original content are replaced with an unique generated block id and
    * stored into `preserved` map.
    * @param {string} htmlString
    * @param {string} openTag Open tag string pattern without open tag ending
    *     character, e.g. "<textarea" or "<code".
    * @param {string} closeTag Close tag string pattern without close tag
    *     ending character, e.g. "</textarea" or "</code".
    * @param {Object} preserved Object to preserve the content indexed by an
    *     unique generated block id.
    * @return {html} The preserved HTML.
    * @protected
    */
		}, {
			key: 'preserveInnerHtml_',
			value: function preserveInnerHtml_(htmlString, openTag, closeTag, preserved) {
				var tagPosEnd = html.lookupPossibleTagBoundary_(htmlString, openTag);
				while (tagPosEnd > -1) {
					var tagEndPos = htmlString.indexOf(closeTag);
					htmlString = html.preserveInterval_(htmlString, tagPosEnd, tagEndPos, preserved);
					htmlString = htmlString.replace(openTag, '%%%~1~%%%');
					htmlString = htmlString.replace(closeTag, '%%%~2~%%%');
					tagPosEnd = html.lookupPossibleTagBoundary_(htmlString, openTag);
				}
				htmlString = htmlString.replace(/%%%~1~%%%/g, openTag);
				htmlString = htmlString.replace(/%%%~2~%%%/g, closeTag);
				return htmlString;
			}

			/**
    * Preserves interval of the specified HTML into the preserved map replacing
    * original contents with an unique generated id.
    * @param {string} htmlString
    * @param {Number} start Start interval position to be replaced.
    * @param {Number} end End interval position to be replaced.
    * @param {Object} preserved Object to preserve the content indexed by an
    *     unique generated block id.
    * @return {string} The HTML with replaced interval.
    * @protected
    */
		}, {
			key: 'preserveInterval_',
			value: function preserveInterval_(htmlString, start, end, preserved) {
				var blockId = '%%%~BLOCK~' + _core['default'].getUid() + '~%%%';
				preserved[blockId] = htmlString.substring(start, end);
				return _string['default'].replaceInterval(htmlString, start, end, blockId);
			}

			/**
    * Preserves outer contents inside the specified tag. When preserved,
    * original content are replaced with an unique generated block id and
    * stored into `preserved` map.
    * @param {string} htmlString
    * @param {string} openTag Open tag string pattern without open tag ending
    *     character, e.g. "<textarea" or "<code".
    * @param {string} closeTag Close tag string pattern without close tag
    *     ending character, e.g. "</textarea" or "</code".
    * @param {Object} preserved Object to preserve the content indexed by an
    *     unique generated block id.
    * @return {html} The preserved HTML.
    * @protected
    */
		}, {
			key: 'preserveOuterHtml_',
			value: function preserveOuterHtml_(htmlString, openTag, closeTag, preserved) {
				var tagPos = htmlString.indexOf(openTag);
				while (tagPos > -1) {
					var tagEndPos = htmlString.indexOf(closeTag) + closeTag.length;
					htmlString = html.preserveInterval_(htmlString, tagPos, tagEndPos, preserved);
					tagPos = htmlString.indexOf(openTag);
				}
				return htmlString;
			}

			/**
    * Removes all comments of the HTML. Including conditional comments and
    * "<![CDATA[" blocks.
    * @param {string} htmlString
    * @return {string} The HTML without comments.
    * @protected
    */
		}, {
			key: 'removeComments_',
			value: function removeComments_(htmlString) {
				var preserved = {};
				htmlString = html.preserveOuterHtml_(htmlString, '<![CDATA[', ']]>', preserved);
				htmlString = html.preserveOuterHtml_(htmlString, '<!--', '-->', preserved);
				htmlString = html.replacePreservedBlocks_(htmlString, preserved, '');
				return htmlString;
			}

			/**
    * Removes spaces between tags, even from inline-block elements.
    * @param {string} htmlString
    * @return {string} The HTML without spaces between tags.
    * @protected
    */
		}, {
			key: 'removeIntertagSpaces_',
			value: function removeIntertagSpaces_(htmlString) {
				htmlString = htmlString.replace(html.Patterns.INTERTAG_CUSTOM_CUSTOM, '~%%%%%%~');
				htmlString = htmlString.replace(html.Patterns.INTERTAG_CUSTOM_TAG, '~%%%<');
				htmlString = htmlString.replace(html.Patterns.INTERTAG_TAG, '><');
				htmlString = htmlString.replace(html.Patterns.INTERTAG_TAG_CUSTOM, '>%%%~');
				return htmlString;
			}

			/**
    * Removes spaces inside tags.
    * @param {string} htmlString
    * @return {string} The HTML without spaces inside tags.
    * @protected
    */
		}, {
			key: 'removeSpacesInsideTags_',
			value: function removeSpacesInsideTags_(htmlString) {
				htmlString = htmlString.replace(html.Patterns.TAG_END_SPACES, '$1$2');
				htmlString = htmlString.replace(html.Patterns.TAG_QUOTE_SPACES, '=$1$2$3');
				return htmlString;
			}

			/**
    * Removes spaces surrounding tags.
    * @param {string} htmlString
    * @return {string} The HTML without spaces surrounding tags.
    * @protected
    */
		}, {
			key: 'removeSurroundingSpaces_',
			value: function removeSurroundingSpaces_(htmlString) {
				return htmlString.replace(html.Patterns.SURROUNDING_SPACES, '$1');
			}

			/**
    * Restores preserved map keys inside the HTML. Note that the passed HTML
    * should contain the unique generated block ids to be replaced.
    * @param {string} htmlString
    * @param {Object} preserved Object to preserve the content indexed by an
    *     unique generated block id.
    * @param {string} replaceValue The value to replace any block id inside the
    * HTML.
    * @return {string}
    * @protected
    */
		}, {
			key: 'replacePreservedBlocks_',
			value: function replacePreservedBlocks_(htmlString, preserved, replaceValue) {
				for (var blockId in preserved) {
					htmlString = htmlString.replace(blockId, replaceValue);
				}
				return htmlString;
			}

			/**
    * Simplifies DOCTYPE declaration to <!DOCTYPE html>.
    * @param {string} htmlString
    * @return {string}
    * @protected
    */
		}, {
			key: 'simplifyDoctype_',
			value: function simplifyDoctype_(htmlString) {
				var preserved = {};
				htmlString = html.preserveOuterHtml_(htmlString, '<!DOCTYPE', '>', preserved);
				htmlString = html.replacePreservedBlocks_(htmlString, preserved, '<!DOCTYPE html>');
				return htmlString;
			}

			/**
    * Restores preserved map original contents inside the HTML. Note that the
    * passed HTML should contain the unique generated block ids to be restored.
    * @param {string} htmlString
    * @param {Object} preserved Object to preserve the content indexed by an
    *     unique generated block id.
    * @return {string}
    * @protected
    */
		}, {
			key: 'returnBlocks_',
			value: function returnBlocks_(htmlString, preserved) {
				for (var blockId in preserved) {
					htmlString = htmlString.replace(blockId, preserved[blockId]);
				}
				return htmlString;
			}
		}]);

		return html;
	})();

	html.Patterns = {
		/**
   * @type {RegExp}
   */
		INTERTAG_CUSTOM_CUSTOM: /~%%%\s+%%%~/g,

		/**
   * @type {RegExp}
   */
		INTERTAG_TAG_CUSTOM: />\s+%%%~/g,

		/**
   * @type {RegExp}
   */
		INTERTAG_CUSTOM_TAG: /~%%%\s+</g,

		/**
   * @type {RegExp}
   */
		INTERTAG_TAG: />\s+</g,

		/**
   * @type {RegExp}
   */
		SURROUNDING_SPACES: /\s*(<[^>]+>)\s*/g,

		/**
   * @type {RegExp}
   */
		TAG_END_SPACES: /(<(?:[^>]+?))(?:\s+?)(\/?>)/g,

		/**
   * @type {RegExp}
   */
		TAG_QUOTE_SPACES: /\s*=\s*(["']?)\s*(.*?)\s*(\1)/g
	};

	module.exports = html;
});
//# sourceMappingURL=html.js.map