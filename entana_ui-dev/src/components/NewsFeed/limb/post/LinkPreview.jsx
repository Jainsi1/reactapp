import React from "react";
import {useQuery} from "@apollo/client";
import {GET_LINK_PREVIEW} from "../../graphql/Query";

const LinkPreview = (props) => {
  const {link} = props;

  const {loading, error, data} = useQuery(GET_LINK_PREVIEW, {
    variables: {
      data: {link}
    }
  });

  if (loading) return <p className="tw-text-center">Loading Link Preview...</p>;
  if (error) return null;

  return (
    <a href={link}
       target="_blank" rel="noreferrer"
       className="tw-border tw-flex hover:tw-bg-gray-100 tw-items-center tw-mx-2 tw-rounded-lg tw-shadow-md">
      {data.getLinkPreview.images && data.getLinkPreview.images.length ?
        <img
          className="tw-h-24 md:tw-h-48 md:tw-rounded-l-lg md:tw-rounded-none tw-object-cover tw-rounded-t-lg tw-w-48"
          src={data.getLinkPreview.images[0]} alt=""/>
        : null
      }
      <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal tw-overflow-hidden">
        <h5
          className="tw-font-semibold tw-max-h-10 tw-mb-2 md:tw-text-2xl tw-overflow-hidden tw-text-gray-800 tw-tracking-tight tw-truncate">{data.getLinkPreview.title}</h5>
        <p style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }} className="tw-text-gray-700 tw-text-sm mb-3">{data.getLinkPreview.description}</p>
      </div>
    </a>
  );
};

export default LinkPreview;