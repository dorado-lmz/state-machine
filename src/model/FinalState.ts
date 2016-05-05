/*
 * Finite state machine library
 * Copyright (c) 2014-5 Steelbreeze Limited
 * Licensed under the MIT and GPL v3 licences
 * http://www.steelbreeze.net/state.cs
 */
module StateJS {
	/**
	 * An element within a state machine model that represents completion of the life of the containing Region within the state machine instance.
	 *
	 * A final state cannot have outbound transitions.
	 *
	 * FinalState extends the State class and inherits its public interface.
	 * @class FinalState
	 * @augments State
	 */
	export class FinalState extends State {
		/**
		 * Creates a new instance of the FinalState class.
		 * @param {string} name The name of the final state.
		 * @param {Element} parent The parent element that owns the final state.
		 */
		public constructor(name: string, parent: Element) {
			super(name, parent);
		}

		/**
		 * Accepts an instance of a visitor and calls the visitFinalState method on it.
		 * @method accept
		 * @param {Visitor<TArg>} visitor The visitor instance.
		 * @param {TArg} arg An optional argument to pass into the visitor.
		 * @returns {any} Any value can be returned by the visitor.
		 */
		public accept<TArg1>(visitor: Visitor<TArg1>, arg1?: TArg1, arg2?: any, arg3?: any): any {
			return visitor.visitFinalState(this, arg1, arg2, arg3);
		}
	}
}