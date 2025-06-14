import React from 'react';
import TagCreator from './TagCreator';
import TagLibrarySummary from './TagLibrarySummary';
import './tagLibrary.scss';

export default function TagLibrary() {
  return (
    <div className="tag-library">
      <div className="tag-library__header">WIP</div>
      <div className="tag-library__content">
        <div className="tag-library__content--left"><TagCreator/></div>
        <div className="tag-library__content--right">
          <TagLibrarySummary />
        </div>
      </div>
    </div>
  );
}
