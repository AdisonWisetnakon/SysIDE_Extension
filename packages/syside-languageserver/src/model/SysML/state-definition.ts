/********************************************************************************
 * Copyright (c) 2022-2025 Sensmetry UAB and others
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License, v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is
 * available at https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { AstNode, LangiumDocument } from "langium";
import { StateDefinition } from "../../generated/ast";
import { ElementIDProvider, MetatypeProto, metamodelOf } from "../metamodel";
import { ActionDefinitionMeta, ActionDefinitionOptions } from "./action-definition";

export interface StateDefinitionOptions extends ActionDefinitionOptions {
    isParallel?: boolean;
}

@metamodelOf(StateDefinition, {
    base: "States::StateAction",
})
export class StateDefinitionMeta extends ActionDefinitionMeta {
    isParallel = false;

    override ast(): StateDefinition | undefined {
        return this._ast as StateDefinition;
    }

    static override create<T extends AstNode>(
        this: MetatypeProto<T>,
        provider: ElementIDProvider,
        document: LangiumDocument,
        options?: StateDefinitionOptions
    ): T["$meta"] {
        const model = super.create(provider, document, options) as StateDefinitionMeta;
        if (options) model.isParallel = Boolean(options.isParallel);
        return model;
    }
}

declare module "../../generated/ast" {
    interface StateDefinition {
        $meta: StateDefinitionMeta;
    }
}
