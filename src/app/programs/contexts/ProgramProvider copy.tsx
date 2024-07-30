// // src/app/programs/contexts/ProgramProvider.tsx
// 'use client';

// import { useState } from 'react';
// import ProgramContext from './ProgramContext';

// type ProgramProviderProps = {
//     children: React.ReactNode;
// };

// const ProgramProvider = ({
//     children
// }: ProgramProviderProps) => {
//     const [maxWidths, setMaxWidths] = useState<{ [key: string]: number }>({});

//     const setMaxWidth = (header: string, width: number) => {
//         setMaxWidths((prevMaxWidths) => {
//             if (!prevMaxWidths[header] || width > prevMaxWidths[header]) {
//                 return { ...prevMaxWidths, [header]: width };
//             }
//             return prevMaxWidths;
//         });
//     };

//     return (
//         <ProgramContext.Provider
//             value={{
//                 maxWidths,
//                 setMaxWidth
//             }}
//         >
//             {children}
//         </ProgramContext.Provider>
//     );
// };

// export default ProgramProvider;
