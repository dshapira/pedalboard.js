// Copyright 2012 Armagan Amcalar. All Rights Reserved.
//
// This file is part of Pedalboard.js.
//
// Pedalboard.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Pedalboard.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Pedalboard.js.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @fileoverview A stage is unique per session, has an Input, an Output and a Board.
 * Its board can be swapped with other boards.
 */

goog.provide('pb.Stage');
goog.require('pb.Board');
goog.require('pb.io.FileInput');
goog.require('pb.io.Output');
goog.require('pb.io.StreamInput');
goog.require('pb.ui.Component');



/**
 * Stage hosts pedal boards, input and output.
 *
 * @constructor
 * @extends {pb.ui.Component}
 */
pb.Stage = function() {
    goog.base(this);
    /**
     * The audio context for this stage.
     *
     * @protected
     * @type {AudioContext}
     */
    this.context = new webkitAudioContext();

    this.initIO();
};
goog.inherits(pb.Stage, pb.ui.Component);


/**
 * Gives the audio context created for this stage. Every effect, input and output in this stage should be declared on
 * this context.
 *
 * @return {AudioContext} The audio context of this stage.
 */
pb.Stage.prototype.getContext = function() {
    return this.context;
};


/**
 * Initializes the input and the output.
 */
pb.Stage.prototype.initIO = function() {
    this.input = new pb.io.FileInput(this.context, 'audio/samples/sample1.mp3');
//    this.input = new pb.io.StreamInput(this.context);
    goog.events.listen(this.input, 'loaded', function() {
        this.route();
    }, false, this);

    this.output = new pb.io.Output(this.context);
};


/**
 * Initializes the pedal components.
 * @param {pb.Board} board Board component.
 */
pb.Stage.prototype.setBoard = function(board) {
    this.board && this.board.dispose();

    this.board = board;
    this.route();

    this.addChild(this.board);
};


/**
 * Routes the signal.
 * Input -> volume pedal -> reverb pedal
 */
pb.Stage.prototype.route = function() {
    this.input.disconnect();
    this.input.connect(this.board);
    this.board.connect(this.output);
};


/**
 * Plays the input.
 *
 * @param {string} url The url of the external sample. Since it will be interpreted as a relative path, it should
 * reside at the domain where the application runs.
 */
pb.Stage.prototype.play = function(url) {
    this.input.disconnect();
    this.input = new pb.io.FileInput(this.context, url);
    this.route();
    this.input.play();
};


/**
 * Stops the input.
 */
pb.Stage.prototype.stop = function() {
    this.input.stop();
};


/**
 * @override
 */
pb.Stage.prototype.templates_base = function() {
    return '<div id="' + this.getId() + '" class="stage"></div>';
};
