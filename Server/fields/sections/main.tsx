import React from 'react';
import { Fragment, useState } from 'react';
import Link from 'next/link';

import { type FieldProps } from '@keystone-6/core/types';
import { css } from '@emotion/css';
import { Button } from '@keystone-ui/button';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { MinusCircleIcon, EditIcon } from '@keystone-ui/icons';
import { type controller } from '@keystone-6/core/fields/types/json/views';

import Faq from './components/Faq';
import Teaser from './components/Teaser';

interface FaqFields {
  question: string;
  answer: string;
}

const styles = {
  form: {
    field: css`
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: css`
      width: 10%;
    `,
    input: css`
      width: 90%;
    `,
    button: css`
      margin: 1rem 0.5rem 0 0;
    `,
  },
  list: {
    ul: css`
      list-style: none;
      margin: 1rem 0 0 0;
      padding: 0;
    `,
    li: css`
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;

      &:nth-of-type(2n) > div:nth-of-type(1) {
        background-color: white;
      }
    `,
    data: css`
      background-color: #eff3f6;
      padding: 0.5rem;
      flex: auto;
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    `,
    dataLabel: css`
      width: 40%;
    `,
    dataHref: css`
      width: 60%;
    `,
    optionButton: css`
      margin: 0 0 0 0.5rem;
    `,
  },
};

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const sections = value ? JSON.parse(value) : [];
  const [index, setIndex] = useState<number | null>(null);

  const [selectedSection, setSelectedSection] = useState<string>('');

  const handleSelectChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const moveSection = (currentIndex: number, direction: 'up' | 'down') => {
    const sectionsCopy = [...sections];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < sectionsCopy.length) {
      const temp = sectionsCopy[currentIndex];
      sectionsCopy[currentIndex] = sectionsCopy[newIndex];
      sectionsCopy[newIndex] = temp;
      onChange(JSON.stringify(sectionsCopy));
    }
  };

  const onDeleteSection = (index: number) => {
    if (onChange) {
      const sectionsCopy = [...sections];
      sectionsCopy.splice(index, 1);
      onChange(JSON.stringify(sectionsCopy));
      // onCancelRelatedLink();
    }
  };

  const onEditSection = (index: number) => {
    if (onChange) {
      setIndex(index);
      // setLabelValue(sections[index].label);
      // setHrefValue(sections[index].href);
    }
  };
  console.log(sections);

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <label htmlFor='selectOption'>Select section type to add:</label>
      <select id='selectOption' value={selectedSection} onChange={handleSelectChange}>
        <option value=''>Välj...</option>
        <option value='FAQ'>FAQ</option>
        <option value='TEASER'>Teaser</option>
      </select>
      {selectedSection === 'FAQ' && (
        <Faq
          onChange={onChange}
          autoFocus={autoFocus}
          sections={sections}
          index={index}
          setIndex={setIndex}
        />
      )}
      {selectedSection === 'TEASER' && (
        <Teaser
          onChange={onChange}
          autoFocus={autoFocus}
          sections={sections}
          index={index}
          setIndex={setIndex}
        />
      )}
      <ul className={styles.list.ul}>
        {sections.map((innerArray, i: number) => {
          // Kontrollera att innerArray är en array och har minst en post
          if (Array.isArray(innerArray) && innerArray.length > 0) {
            const type = innerArray[0].type; // Hämta typen från den första posten i innerArray

            return (
              <li key={`related-link-${i}`} className={styles.list.li}>
                <div className={styles.list.data}>
                  <div className={styles.list.dataLabel}>{type}</div>
                </div>
                {onChange && (
                  <div>
                    <Button
                      size='small'
                      className={styles.list.optionButton}
                      onClick={() => moveSection(i, 'up')}
                    >
                      {' '}
                      &#9650;
                      {/* <ArrowUpIcon size='small' /> */}
                    </Button>
                    <Button
                      size='small'
                      className={styles.list.optionButton}
                      onClick={() => moveSection(i, 'down')}
                    >
                      &#9660;
                      {/* <ArrowDownIcon size='small' /> */}
                    </Button>
                    {/* <Button
                      size='small'
                      onClick={() => onEditSection(i)}
                      className={styles.list.optionButton}
                    >
                      <EditIcon size='small' color='blue' />
                    </Button> */}
                    <Button size='small' className={styles.list.optionButton}>
                      <MinusCircleIcon
                        size='small'
                        color='red'
                        onClick={() => onDeleteSection(i)}
                      />
                    </Button>
                  </div>
                )}
              </li>
            );
          }

          return null;
        })}
      </ul>
    </FieldContainer>
  );
};

// {sections.map((item, i: number) => {
//   return (
//     <li key={`related-link-${i}`} className={styles.list.li}>
//       <div className={styles.list.data}>
//         <div className={styles.list.dataLabel}>{item.type}</div>
//         {/* <div className={styles.list.dataLabel}>{relatedLink.label}</div> */}
//       </div>
//       {onChange && (
//         <div>
//           <Button
//             size='small'
//             onClick={() => onEditSection(i)}
//             className={styles.list.optionButton}
//           >
//             <EditIcon size='small' color='blue' />
//           </Button>
//           <Button size='small' className={styles.list.optionButton}>
//             <MinusCircleIcon
//               size='small'
//               color='red'
//               onClick={() => onDeleteSection(i)}
//             />
//           </Button>
//         </div>
//       )}
//     </li>
//   );
// })}

// export const Field = ({
//   field,
//   value,
//   onChange,
//   autoFocus,
// }: FieldProps<typeof controller>) => {
//   const [sections, setSections] = useState<string[]>(['FAQ', 'Links']);

//   const [labelValue, setLabelValue] = useState('');
//   const [hrefValue, setHrefValue] = useState('');
//   const [index, setIndex] = useState<number | null>(null);

//   const [questionValue, setQuestionValue] = useState('');
//   const [answerValue, setAnswerValue] = useState('');
//   const [questionIndex, setQuestionIndex] = useState<number | null>(null);

//   const faqs: FaqFields[] = value ? JSON.parse(value) : [];

//   const relatedLinks: RelatedLink[] = value ? JSON.parse(value) : [];

//   console.log(onChange);

//   // FAQ functions

//   const onSubmitNewQuestion = () => {
//     if (onChange) {
//       const sectionsCopy = [
//         ...sections,
//         { question: questionValue, answer: answerValue },
//       ];
//       onChange(JSON.stringify(sectionsCopy));
//       onCancelQuestion();
//     }
//   };

//   const onDeleteQuestion = (index: number) => {
//     if (onChange) {
//       const sectionsCopy = [...sections];
//       sectionsCopy.splice(index, 1);
//       onChange(JSON.stringify(sectionsCopy));
//       onCancelQuestion();
//     }
//   };

//   const onEditQuestion = (index: number) => {
//     if (onChange) {
//       setQuestionIndex(index);
//       setQuestionValue(sections[index].question);
//       setAnswerValue(sections[index].answer);
//     }
//   };

//   const onUpdateQuestion = () => {
//     if (onChange && index !== null) {
//       const sectionsCopy = [...sections];
//       sectionsCopy[index] = { question: questionValue, answer: answerValue };
//       onChange(JSON.stringify(sectionsCopy));
//       onCancelQuestion();
//     }
//   };

//   const onCancelQuestion = () => {
//     setQuestionIndex(null);
//     setQuestionValue('');
//     setAnswerValue('');
//   };

//   // Links functions

//   const onSubmitNewRelatedLink = () => {
//     if (onChange) {
//       const relatedLinksCopy = [...relatedLinks, { label: labelValue, href: hrefValue }];
//       onChange(JSON.stringify(relatedLinksCopy));
//       onCancelRelatedLink();
//     }
//   };

//   const onDeleteRelatedLink = (index: number) => {
//     if (onChange) {
//       const relatedLinksCopy = [...relatedLinks];
//       relatedLinksCopy.splice(index, 1);
//       onChange(JSON.stringify(relatedLinksCopy));
//       onCancelRelatedLink();
//     }
//   };

//   const onEditRelatedLink = (index: number) => {
//     if (onChange) {
//       setIndex(index);
//       setLabelValue(relatedLinks[index].label);
//       setHrefValue(relatedLinks[index].href);
//     }
//   };

//   const onUpdateRelatedLink = () => {
//     if (onChange && index !== null) {
//       const relatedLinksCopy = [...relatedLinks];
//       relatedLinksCopy[index] = { label: labelValue, href: hrefValue };
//       onChange(JSON.stringify(relatedLinksCopy));
//       onCancelRelatedLink();
//     }
//   };

//   const onCancelRelatedLink = () => {
//     setIndex(null);
//     setLabelValue('');
//     setHrefValue('');
//   };

//   return (
//     <FieldContainer>
//       <FieldLabel>{field.label}</FieldLabel>
//       <FieldLabel>FAQ</FieldLabel>
//       {onChange && (
//         <Fragment>
//           {/* FAQ field section */}
//           <div className={styles.form.field}>
//             <FieldLabel className={styles.form.label}>Question</FieldLabel>
//             <TextInput
//               autoFocus={autoFocus}
//               onChange={(event) => setQuestionValue(event.target.value)}
//               value={questionValue}
//               className={styles.form.input}
//             />
//           </div>
//           <div className={styles.form.field}>
//             <FieldLabel className={styles.form.label}>Answer</FieldLabel>
//             <TextInput
//               autoFocus={autoFocus}
//               onChange={(event) => setAnswerValue(event.target.value)}
//               value={answerValue}
//               className={styles.form.input}
//             />
//           </div>

//           {questionIndex !== null ? (
//             <Fragment>
//               <Button onClick={onUpdateQuestion} className={styles.form.button}>
//                 Update
//               </Button>
//               <Button onClick={onCancelQuestion} className={styles.form.button}>
//                 Cancel
//               </Button>
//             </Fragment>
//           ) : (
//             <Button onClick={onSubmitNewQuestion} className={styles.form.button}>
//               Add Faq-item
//             </Button>
//           )}

//           {/* Links field section */}
//           <FieldLabel>Links</FieldLabel>
//           <div className={styles.form.field}>
//             <FieldLabel className={styles.form.label}>Label</FieldLabel>
//             <TextInput
//               autoFocus={autoFocus}
//               onChange={(event) => setLabelValue(event.target.value)}
//               value={labelValue}
//               className={styles.form.input}
//             />
//           </div>
//           <div className={styles.form.field}>
//             <FieldLabel className={styles.form.label}>Href</FieldLabel>
//             <TextInput
//               autoFocus={autoFocus}
//               onChange={(event) => setHrefValue(event.target.value)}
//               value={hrefValue}
//               className={styles.form.input}
//             />
//           </div>

//           {index !== null ? (
//             <Fragment>
//               <Button onClick={onUpdateRelatedLink} className={styles.form.button}>
//                 Update
//               </Button>
//               <Button onClick={onCancelRelatedLink} className={styles.form.button}>
//                 Cancel
//               </Button>
//             </Fragment>
//           ) : (
//             <Button onClick={onSubmitNewRelatedLink} className={styles.form.button}>
//               Add
//             </Button>
//           )}
//         </Fragment>
//       )}
//       <FieldLabel>Sparade länkar</FieldLabel>
//       <ul className={styles.list.ul}>
//         {/* Render links */}

//         {sections.map((relatedLink, i: number) => {
//           return (
//             <li key={`related-link-${i}`} className={styles.list.li}>
//               <div className={styles.list.data}>
//                 <div className={styles.list.dataLabel}>{relatedLink.label}</div>
//                 <div className={styles.list.dataLabel}>{relatedLink.href}</div>
//                 {/* <div className={styles.list.dataHref}>
//                   <Link href={relatedLink.href} target='_blank'>
//                     {relatedLink.href}
//                   </Link>
//                 </div> */}
//               </div>
//               {onChange && (
//                 <div>
//                   <Button
//                     size='small'
//                     onClick={() => onEditRelatedLink(i)}
//                     className={styles.list.optionButton}
//                   >
//                     <EditIcon size='small' color='blue' />
//                   </Button>
//                   <Button size='small' className={styles.list.optionButton}>
//                     <MinusCircleIcon
//                       size='small'
//                       color='red'
//                       onClick={() => onDeleteRelatedLink(i)}
//                     />
//                   </Button>
//                 </div>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//       {/* Render faq */}
//       <FieldLabel>Sparade Faq</FieldLabel>
//       <ul className={styles.list.ul}>
//         {faqs.map((faq: FaqFields, i: number) => {
//           return (
//             <li key={`faq-question-${i}`} className={styles.list.li}>
//               <div className={styles.list.data}>
//                 <div className={styles.list.dataLabel}>{faq.question}</div>
//                 <div className={styles.list.dataLabel}>{faq.answer}</div>
//               </div>
//               {onChange && (
//                 <div>
//                   <Button
//                     size='small'
//                     onClick={() => onEditQuestion(i)}
//                     className={styles.list.optionButton}
//                   >
//                     <EditIcon size='small' color='blue' />
//                   </Button>
//                   <Button size='small' className={styles.list.optionButton}>
//                     <MinusCircleIcon
//                       size='small'
//                       color='red'
//                       onClick={() => onDeleteQuestion(i)}
//                     />
//                   </Button>
//                 </div>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </FieldContainer>
//   );
// };
