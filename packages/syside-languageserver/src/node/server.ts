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

import {
    createConnection,
    ProposedFeatures,
    StreamMessageReader,
    StreamMessageWriter,
    MessageReader,
    MessageWriter,
    Message,
    Disposable,
    DataCallback,
} from "vscode-languageserver/node";
import { createSysMLServices } from "../sysml-module";
import { createTransport, NodeLauncherOptions } from "./cli";
import { SysMLNodeFileSystem } from "./node-file-system-provider";
import { startServer as _startServer } from "../launch";
import { logToDebugFile } from "../logger";

class LoggingReader implements MessageReader {
    constructor(private readonly wrapped: MessageReader) {}

    listen(callback: DataCallback): Disposable {
        const disposable = this.wrapped.listen((msg: Message) => {
            let str = `[From client To Server]\nContent-Length: ${JSON.stringify(msg).length}\n${JSON.stringify(msg, null, 2)}\n\n\n`;
            console.log(str);
            logToDebugFile(str);
            callback(msg);
        });

        return disposable;
    }

    dispose(): void {
        this.wrapped.dispose();
    }

    onError = this.wrapped.onError?.bind(this.wrapped);
    onClose = this.wrapped.onClose?.bind(this.wrapped);
    onPartialMessage = this.wrapped.onPartialMessage?.bind(this.wrapped);
}

class LoggingWriter implements MessageWriter {
    constructor(private readonly wrapped: MessageWriter) {}

    write(msg: Message): Promise<void> {
        let str: string = `[From Server To Client]\nContent-Length: ${JSON.stringify(msg).length}\n${JSON.stringify(msg, null, 2)}\n\n\n`;
        console.log(str);
        logToDebugFile(str);
        return this.wrapped.write(msg);
    }

    end(): void {
        if (typeof this.wrapped.end === "function") {
            this.wrapped.end();
        }
    }

    dispose(): void {
        this.wrapped.dispose();
    }

    onError = this.wrapped.onError?.bind(this.wrapped);
    onClose = this.wrapped.onClose?.bind(this.wrapped);
}

export function startServer(options: NodeLauncherOptions): ReturnType<typeof createSysMLServices> {
    const [rawInput, rawOutput] = createTransport(options);
    const input = new LoggingReader(rawInput as MessageReader);
    const output = new LoggingWriter(rawOutput as MessageWriter);

    const connection = createConnection(ProposedFeatures.all, input as any, output as any);

    return _startServer(connection, SysMLNodeFileSystem, options);
}
