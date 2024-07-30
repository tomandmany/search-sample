// // src/components/TableCell.tsx
// 'use client';

// import {
//     useEffect,
//     useRef,
//     useState,
//     KeyboardEvent as ReactKeyboardEvent,
//     FocusEvent as ReactFocusEvent,
// } from 'react';
// import updateParticipant from '@/actions/participants/updateParticipant';
// import CustomSelect from './contents/CustomSelect';
// import SocialMedia from './contents/SocialMedia';

// type TableCellProps = {
//     header: string;
//     property?: string;
//     programId?: string;
//     participantId?: string;
//     value: string;
//     maxWidths: { [key: string]: number };
//     setMaxWidth: (header: string, width: number) => void;
//     rowHeight: number;
//     setRowHeight: (height: number) => void;
//     isParticipantColumn: boolean;
//     participantSocialMedias?: ParticipantSocialMedia[];
// };

// const getWidth = (text: string, font: string): number => {
//     if (typeof document !== 'undefined') {
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         if (context) {
//             context.font = font;
//             const metrics = context.measureText(text);
//             return metrics.width;
//         }
//     }
//     return 50;
// };

// const selectOptions: { [key: string]: string[] } = {
//     'ジャンル': ['音楽', 'ダンス', 'パフォーマンス'],
//     '実施場所': ['メインステージ', 'パフォーマンスエリア', 'エントランスエリア'],
//     '企画実施日': ['2日', '3日', '4日']
// };

// export default function TableCell({
//     header,
//     property,
//     participantId,
//     value,
//     maxWidths,
//     setMaxWidth,
//     rowHeight,
//     setRowHeight,
//     isParticipantColumn,
//     participantSocialMedias,
// }: TableCellProps) {
//     const [inputValue, setInputValue] = useState<string>(value);
//     const [inputWidth, setInputWidth] = useState<number>(50);
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [currentParticipantSocialMedias, setCurrentParticipantSocialMedias] = useState<ParticipantSocialMedia[]>([]);
//     const ref = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const font = getComputedStyle(document.body).font;
//         const width = getWidth(inputValue, font) + 18; // 余白のために少し幅を追加
//         setInputWidth(width);
//         setMaxWidth(header, width);
//     }, [inputValue, header, setMaxWidth]);

//     useEffect(() => {
//         if (ref.current) {
//             const currentHeight = ref.current.offsetHeight;
//             if (currentHeight !== rowHeight) {
//                 setRowHeight(currentHeight);
//             }
//         }
//     }, [inputValue, currentParticipantSocialMedias, rowHeight, setRowHeight]);

//     useEffect(() => {
//         const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//             if (hasUnsavedChanges) {
//                 event.preventDefault();
//                 event.returnValue = '';
//             }
//         };

//         window.addEventListener('beforeunload', handleBeforeUnload);
//         return () => {
//             window.removeEventListener('beforeunload', handleBeforeUnload);
//         };
//     }, [hasUnsavedChanges]);

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setInputValue(event.target.value);
//         setHasUnsavedChanges(true);
//     };

//     const handleKeyDown = async (event: ReactKeyboardEvent<HTMLInputElement>) => {
//         if ((event.metaKey && event.key === 'Enter') || (event.ctrlKey && event.key === 'Enter')) {
//             const target = event.target as HTMLInputElement;
//             target.blur(); // Blur the input to trigger the handleBlur event
//         }
//     };

//     const handleBlur = async (event: ReactFocusEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const newValue = event.target.value;
//         if (newValue.trim() === '') {
//             setError('このフィールドは空にできません');
//             return;
//         }
//         if (!participantId) {
//             setError('No ID provided');
//             return;
//         }
//         const formData = new FormData();
//         if (participantId) {
//             formData.append('id', participantId);
//             if (property) {
//                 formData.append(property, newValue);
//             }
//             const response = await updateParticipant(formData);
//             if (!response.success) {
//                 console.error('Failed to update participant:', response.error);
//                 setError('Failed to update participant');
//             } else {
//                 setError(null);
//             }
//         }
//         setHasUnsavedChanges(false);
//     };

//     const maxWidth = maxWidths[header] || inputWidth;

//     let content;
//     if (selectOptions[header]) {
//         content = (
//             <CustomSelect
//                 value={inputValue}
//                 options={selectOptions[header]}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 maxWidth={maxWidth}
//             />
//         );
//     } else {
//         switch (header) {
//             case 'SNSアカウント':
//                 content = (
//                     participantId &&
//                     <SocialMedia
//                         participantId={participantId}
//                         participantSocialMedias={participantSocialMedias!}
//                         currentParticipantSocialMedias={currentParticipantSocialMedias}
//                         setCurrentParticipantSocialMedias={setCurrentParticipantSocialMedias}
//                         setRowHeight={setRowHeight}
//                     />
//                 );
//                 break;
//             default:
//                 content = (
//                     <input
//                         type="text"
//                         value={inputValue}
//                         className={`cursor-pointer rounded px-2 py-1 hover:bg-gray-200 focus:bg-inherit focus:hover:bg-inherit focus:cursor-text ${error && 'border-2 border-red-600'}`}
//                         onChange={handleChange}
//                         onKeyDown={handleKeyDown}
//                         onBlur={handleBlur}
//                         style={{ minWidth: `${maxWidth}px` }}
//                     />
//                 );
//         }
//     }

//     return (
//         <div
//             ref={ref}
//             className={`min-w-max p-2 bg-white border-b flex flex-col justify-center items-center ${header === 'SNSアカウント' && 'justify-center'}`}
//             style={{ minHeight: `${rowHeight}px` }}
//         >
//             {content}
//             {error && <div className="text-red-600">{error}</div>}
//         </div>
//     );
// }
