"use client"

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

const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    title, 
    children 
}: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean, 
    title: string, 
    children: React.ReactNode 
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded hover:bg-gray-200 ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'} ${disabled ? 'disabled:opacity-40' : ''}`.trim()}
        title={title}
    >
        {children}
    </button>
)

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />

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
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
                    <Undo size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
                    <Redo size={16} />
                </ToolbarButton>

                <Divider />

                {/* Formato de texto */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Negrita (Ctrl+B)">
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Cursiva (Ctrl+I)">
                    <Italic size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Subrayado (Ctrl+U)">
                    <UnderlineIcon size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Tachado">
                    <Strikethrough size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Limpiar formato">
                    <RemoveFormatting size={16} />
                </ToolbarButton>

                <Divider />

                {/* Encabezados */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Título 1">
                    <Heading1 size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Título 2">
                    <Heading2 size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Título 3">
                    <Heading3 size={16} />
                </ToolbarButton>

                <Divider />

                {/* Código */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Código en línea">
                    <Code size={16} />
                </ToolbarButton>

                <Divider />

                {/* Listas */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista con viñetas">
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista numerada">
                    <ListOrdered size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Aumentar sangría">
                    <Indent size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Reducir sangría">
                    <Outdent size={16} />
                </ToolbarButton>

                <Divider />

                {/* Cita */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Cita">
                    <Quote size={16} />
                </ToolbarButton>

                {/* Separador */}
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Línea horizontal">
                    <Minus size={16} />
                </ToolbarButton>

                <Divider />

                {/* Alineación */}
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Alinear a la izquierda">
                    <AlignLeft size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Centrar">
                    <AlignCenter size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Alinear a la derecha">
                    <AlignRight size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justificar">
                    <AlignJustify size={16} />
                </ToolbarButton>
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
