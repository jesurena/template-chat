'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckOutlined, RobotOutlined, CopyOutlined } from '@ant-design/icons';
import { Loader2 } from 'lucide-react';
import { Avatar, Tooltip } from 'antd';
import { ChatMessage } from '@/interface/Chat';
import { copyToClipboard } from '@/utils/clipboard';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    isTyping?: boolean;
}

function normalizeMarkdown(text: string) {
    const normalized = text.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    const output: string[] = [];
    let inCodeFence = false;

    const normalizePipeChars = (line: string) => line.replace(/[｜│┃]/g, '|');

    const countPipes = (line: string) => (line.match(/\|/g) || []).length;

    const isPipeRow = (line: string) => {
        const normalizedLine = normalizePipeChars(line);
        const trimmed = normalizedLine.trim();
        return countPipes(trimmed) >= 2 && !trimmed.startsWith('>');
    };

    const isSeparatorCell = (cell: string) => /^:?-{3,}:?$/.test(cell.trim());

    const toCells = (line: string) => {
        const trimmed = normalizePipeChars(line).trim();
        const withoutEdges = trimmed.replace(/^\|/, '').replace(/\|$/, '');
        return withoutEdges.split('|').map((cell) => cell.trim());
    };

    const formatRow = (cells: string[], totalColumns: number) => {
        const padded = [...cells];
        while (padded.length < totalColumns) {
            padded.push('');
        }
        return `| ${padded.join(' | ')} |`;
    };

    for (let index = 0; index < lines.length; index++) {
        const current = lines[index];

        if (current.trim().startsWith('```')) {
            inCodeFence = !inCodeFence;
            output.push(current);
            continue;
        }

        if (inCodeFence) {
            output.push(current);
            continue;
        }

        if (!isPipeRow(current)) {
            output.push(current);
            continue;
        }

        const block: string[] = [];
        let cursor = index;

        while (cursor < lines.length) {
            const candidate = lines[cursor];
            if (candidate.trim() === '') {
                cursor += 1;
                continue;
            }

            if (!isPipeRow(candidate)) {
                break;
            }

            block.push(candidate);
            cursor += 1;
        }

        if (block.length < 2) {
            output.push(current);
            continue;
        }

        index = cursor - 1;

        const parsedRows = block.map(toCells);
        const totalColumns = Math.max(...parsedRows.map((row) => row.length));

        if (totalColumns < 2) {
            output.push(...block);
            continue;
        }

        if (output.length > 0 && output[output.length - 1].trim() !== '') {
            output.push('');
        }

        if (parsedRows.length >= 2 && parsedRows[1].every(isSeparatorCell)) {
            output.push(...parsedRows.map((row) => formatRow(row, totalColumns)));
            output.push('');
            continue;
        }

        const separator = Array.from({ length: totalColumns }, () => '---');
        output.push(formatRow(parsedRows[0], totalColumns));
        output.push(formatRow(separator, totalColumns));

        for (let rowIndex = 1; rowIndex < parsedRows.length; rowIndex++) {
            output.push(formatRow(parsedRows[rowIndex], totalColumns));
        }

        output.push('');
    }

    return output.join('\n');
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="py-6 space-y-6 px-4 md:px-0">
            {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col gap-1", msg.IsUser ? "items-end" : "items-start")}>
                    <div className="flex items-end gap-2 max-w-[90%]">
                        {!msg.IsUser && (
                            <Avatar
                                size={32}
                                icon={<RobotOutlined />}
                                className="bg-primary shadow-sm shrink-0 mb-0.5"
                            />
                        )}
                        {(msg.Text || (!msg.IsUser && isTyping && i === messages.length - 1)) && (
                            <div className={cn(
                                "px-5 py-3 text-[15px] leading-relaxed shadow-sm transition-all duration-300",
                                msg.IsUser
                                    ? "bg-primary text-white rounded-[24px] rounded-br-none whitespace-pre-wrap"
                                    : "bg-neutral text-foreground rounded-[24px] rounded-bl-none"
                            )}>
                                {msg.IsUser ? (
                                    msg.Text
                                ) : (
                                    <div className="relative group/bubble">
                                        {!msg.Text && isTyping ? (
                                            <div className="flex items-center gap-2 text-gray-400 italic">
                                                <Loader2 className="w-4 h-4 animate-spin text-accent-1" />
                                                <span>Thinking...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="chat-markdown pr-6">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{normalizeMarkdown(msg.Text)}</ReactMarkdown>
                                                </div>
                                                {msg.Text && !isTyping && (
                                                    <div className="absolute top-0 right-[-8px]">
                                                        <Tooltip title="Copy message">
                                                            <button
                                                                onClick={() => copyToClipboard(msg.Text)}
                                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-info hover:text-text-info/80 transition-all cursor-pointer"
                                                            >
                                                                <CopyOutlined className="text-[14px]" />
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {msg.IsUser ? (
                        <div className="flex items-center gap-1.5 px-1 mt-1">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {mounted && new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                            <div className="flex items-center -space-x-1.5">
                                {msg.Status === 'sending' ? (
                                    <Loader2 className="text-[11px] text-accent-1 animate-spin" />
                                ) : (
                                    <>
                                        <CheckOutlined className="text-[11px] text-accent-1 font-bold" />
                                        {msg.Status === 'delivered' && (
                                            <CheckOutlined className="text-[11px] text-accent-1 font-bold" />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-1 mt-1 ml-10">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {mounted && new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
}
