/**
 * This is the tag object
 *
 * @param tagName
 * @param tagColor
 * @constructor
 */
function Tag(tagName, tagColor) {
    this.tagName = tagName;
    this.tagColor = tagColor;

    /**
     * Returns whether or not a tag matches another
     *
     * @param tag can pass either a string or a tag
     * @returns {boolean}
     */
    this.match = function (tag) {
        var matchString;

        if (tag.tagName) {
            matchString = tag.tagName;
        }
        else {
            matchString = tag;
        }
        return this.tagName.match(matchString) == matchString;
    };
}
