import React from 'react';
import Link from 'next/link';
import { type FieldProps } from '@keystone-6/core/types';
import { css } from '@emotion/css';
import { Button } from '@keystone-ui/button';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { MinusCircleIcon, EditIcon } from '@keystone-ui/icons';
import { type controller } from '@keystone-6/core/fields/types/json/views';
import { Fragment, useState } from 'react';

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

export default function Teaser({ onChange, autoFocus, sections, index, setIndex }) {
  const [teaserText, setTeaserText] = useState('');
  const [hrefValue, setHrefValue] = useState('');

  const onSubmitNewTeaser = (target) => {
    if (onChange) {
      const sectionsCopy = [
        ...sections,
        [
          { type: 'TEASER' },
          {
            text: teaserText,
            href: hrefValue,
          },
        ],
      ];
      onChange(JSON.stringify(sectionsCopy));
      onCancelRelatedLink();
    }
  };

  const onDeleteRelatedLink = (index: number) => {
    if (onChange) {
      const sectionsCopy = [...sections];
      sectionsCopy.splice(index, 1);
      onChange(JSON.stringify(sectionsCopy));
      onCancelRelatedLink();
    }
  };

  const onEditRelatedLink = (index: number) => {
    if (onChange) {
      setIndex(index);
      setTeaserText(sections[index].text);
      setHrefValue(sections[index].href);
    }
  };

  const onUpdateRelatedLink = () => {
    if (onChange && index !== null) {
      const sectionsCopy = [...sections];
      sectionsCopy[index] = { text: teaserText, href: hrefValue };
      onChange(JSON.stringify(sectionsCopy));
      onCancelRelatedLink();
    }
  };

  const onCancelRelatedLink = () => {
    setIndex(null);
    setTeaserText('');
    setHrefValue('');
  };

  return (
    <>
      <FieldLabel>Add a Teaser-section</FieldLabel>
      <Fragment>
        <div className={styles.form.field}>
          <FieldLabel className={styles.form.label}>Text</FieldLabel>
          <TextInput
            autoFocus={autoFocus}
            onChange={(event) => setTeaserText(event.target.value)}
            value={teaserText}
            className={styles.form.input}
            data-id='TEASER'
          />
        </div>
        <div className={styles.form.field}>
          <FieldLabel className={styles.form.label}>Href</FieldLabel>
          <TextInput
            autoFocus={autoFocus}
            onChange={(event) => setHrefValue(event.target.value)}
            value={hrefValue}
            className={styles.form.input}
          />
        </div>

        {index !== null ? (
          <Fragment>
            <Button onClick={onUpdateRelatedLink} className={styles.form.button}>
              Update
            </Button>
            <Button onClick={onCancelRelatedLink} className={styles.form.button}>
              Cancel
            </Button>
          </Fragment>
        ) : (
          <Button
            onClick={(event) => onSubmitNewTeaser('TEASER')}
            className={styles.form.button}
            data-id='TEASER'
          >
            Add Section
          </Button>
        )}
      </Fragment>
    </>
  );
}
