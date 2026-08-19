"use client"

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Quote, Undo, Redo, Heading1, Heading2, Heading3, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Indent, Outdent, RemoveFormatting } from 'lucide-react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export const RichTextEditor = ({ value, onChange, placeholder = 'Escribe aquí...' }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[200px] p-4',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-gray-200 bg-gray-50">

                {/* Deshacer / Rehacer */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-40"
                    title="Deshacer"
                >
                    <Undo size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-40"
                    title="Rehacer"
                >
                    <Redo size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Formato de texto */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Negrita (Ctrl+B)"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Cursiva (Ctrl+I)"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Subrayado (Ctrl+U)"
                >
                    <UnderlineIcon size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Tachado"
                >
                    <Strikethrough size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                    title="Limpiar formato"
                >
                    <RemoveFormatting size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Encabezados */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Título 1"
                >
                    <Heading1 size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Título 2"
                >
                    <Heading2 size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Título 3"
                >
                    <Heading3 size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Código */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Código en línea"
                >
                    <Code size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Listas */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Lista con viñetas"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Lista numerada"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                    title="Aumentar sangría"
                >
                    <Indent size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                    title="Reducir sangría"
                >
                    <Outdent size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Cita */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Cita"
                >
                    <Quote size={16} />
                </button>

                {/* Separador */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                    title="Línea horizontal"
                >
                    <Minus size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Alineación */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Alinear a la izquierda"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Centrar"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Alinear a la derecha"
                >
                    <AlignRight size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    title="Justificar"
                >
                    <AlignJustify size={16} />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="min-h-[200px] relative" />

            {/* Placeholder */}
            {!editor.getText() && (
                <div className="absolute top-14 left-4 text-gray-400 pointer-events-none">
                    {placeholder}
                </div>
            )}
        </div>
    )
}

export default RichTextEditor
