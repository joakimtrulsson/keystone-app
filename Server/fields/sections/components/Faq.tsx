import React from 'react';
import Link from 'next/link';
import { type FieldProps } from '@keystone-6/core/types';
import { css } from '@emotion/css';
import { Button } from '@keystone-ui/button';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { MinusCircleIcon, EditIcon } from '@keystone-ui/icons';
import { type controller } from '@keystone-6/core/fields/types/json/views';
import { Fragment, useState } from 'react';

// import './styles.css';

interface RelatedLink {
  label: string;
  href: string;
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

export default function Faq({ onChange, autoFocus, sections, index, setIndex }) {
  const [questionValue, setQuestionValue] = useState('');
  const [answerValue, setAnswerValue] = useState('');
  const [faq, setFaq] = useState([]);

  const onAddQuestion = (event, target) => {
    event.preventDefault();
    if (onChange) {
      {
        setFaq([...faq, { question: questionValue, answer: answerValue }]);
        setQuestionValue('');
        setAnswerValue('');
        // onChange(JSON.stringify([...sections, faq])); // Lägg till den nuvarande frågan och svar till listan
      }
    }
  };

  const onSubmitSection = (target) => {
    if (onChange) {
      const sectionsCopy = [...sections, [{ type: 'FAQ' }, ...faq]];
      onChange(JSON.stringify(sectionsCopy));
      onCancelRelatedLink();
    }
  };

  // const onDeleteRelatedLink = (index: number) => {
  //   if (onChange) {
  //     const sectionsCopy = [...sections];
  //     sectionsCopy.splice(index, 1);
  //     onChange(JSON.stringify(sectionsCopy));
  //     onCancelRelatedLink();
  //   }
  // };

  // const onEditRelatedLink = (index: number) => {
  //   if (onChange) {
  //     setIndex(index);
  //     setQuestionValue(sections[index].label);
  //     setAnswerValue(sections[index].href);
  //   }
  // };

  const onUpdateRelatedLink = () => {
    if (onChange && index !== null) {
      const sectionsCopy = [...sections];
      sectionsCopy[index] = { question: questionValue, answer: answerValue };
      onChange(JSON.stringify(sectionsCopy));
      onCancelRelatedLink();
    }
  };

  const onCancelRelatedLink = () => {
    setIndex(null);
    setQuestionValue('');
    setAnswerValue('');
  };

  return (
    <>
      <FieldLabel>Add a FAQ-section</FieldLabel>
      <Fragment>
        {faq && (
          <div className={styles.list.ul}>
            {faq.map((item, index) => (
              <li key={index}>{item.question}</li>
            ))}
          </div>
        )}

        <div className={styles.form.field}>
          <FieldLabel className={styles.form.label}>Question:</FieldLabel>
          <TextInput
            autoFocus={autoFocus}
            onChange={(event) => setQuestionValue(event.target.value)}
            value={questionValue}
            className={styles.form.input}
            data-id='FAQ'
          />
        </div>
        <div className={styles.form.field}>
          <FieldLabel className={styles.form.label}>Answer:</FieldLabel>
          <TextInput
            autoFocus={autoFocus}
            onChange={(event) => setAnswerValue(event.target.value)}
            value={answerValue}
            className={styles.form.input}
          />
        </div>
        <Button
          onClick={(event) => onAddQuestion(event, 'FAQ')}
          className={styles.form.button}
          data-id='FAQ'
        >
          Add Question
        </Button>

        <Button
          onClick={() => onSubmitSection('FAQ')}
          className={styles.form.button}
          data-id='FAQ'
        >
          Add Section
        </Button>
      </Fragment>
    </>
  );
}
