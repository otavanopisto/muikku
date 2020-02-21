import * as React from 'react';

import '~/sass/elements/instagram-gallery.scss';

interface FrontpageInstagramGalleryProps {
  userId: string,
  photoCount: number,
  thumbnailWidth: number,
}

interface FrontpageInstagramGalleryState {
  photos: Array<any>
}

export default class FrontpageInstagramGallery extends React.Component<FrontpageInstagramGalleryProps, FrontpageInstagramGalleryState> {
  constructor(props: FrontpageInstagramGalleryProps){
    super(props);

    this.state = {
      photos: []
    };
  }

  async componentDidMount() {
    try {
      // Hack from https://stackoverflow.com/a/47243409/2217533
      const response = await fetch(
        `https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={"id":"${
          this.props.userId
        }","first":${this.props.photoCount},"after":null}`
      );
      const { data } = await response.json();
      const photos = data.user.edge_owner_to_timeline_media.edges.map(
        ({ node }: any) => {
          const { id } = node;
          const caption = node.edge_media_to_caption.edges[0].node.text;
          const thumbnail = node.thumbnail_resources.find(
            (thumbnail: any) => thumbnail.config_width === this.props.thumbnailWidth
          );
          const { src, config_width: width, config_height: height } = thumbnail;
          const url = `https://www.instagram.com/p/${node.shortcode}`;
          return {
            id,
            caption,
            src,
            width,
            height,
            url
          };
        }
      );
      this.setState({ photos });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div className="instagram-feed">
        {this.state.photos && this.state.photos.map(({ src, url }) => (
          <a href={url} target="_blank" key={src}>
            <img className="instagram-feed__item" src={src} />
          </a>
        ))}
      </div>
    );
  }
}