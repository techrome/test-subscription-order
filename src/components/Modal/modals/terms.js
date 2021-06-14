import React from 'react';
import { connect } from 'react-redux';

import Modal from './_base';

const TermsModal = ({ onClose, onConfirm, ...props }) => {
  return (
    <Modal
      onClose={onClose}
      title="Terms and conditions"
      onConfirm={() => {
        onConfirm();
        onClose();
      }}
      confirmText="I agree"
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dolor
      metus, maximus ac arcu sit amet, eleifend tempus sem. Morbi pulvinar
      lectus justo, a porttitor metus porttitor quis. Nullam vitae nunc id
      libero pharetra maximus. Donec condimentum ornare ex, id tristique elit
      porta et. Praesent viverra, risus a mattis feugiat, risus nunc interdum
      magna, iaculis vulputate est nibh sit amet metus. Cras vehicula mauris sed
      metus ultricies placerat. Nam cursus bibendum lectus nec mollis. Sed nec
      nulla dui. Vestibulum ac viverra velit. Phasellus ullamcorper felis ac
      tortor blandit fermentum. Nunc commodo aliquam tempor. Ut molestie elit
      sed blandit imperdiet. Quisque tincidunt neque nunc, ac pellentesque justo
      fringilla id. Proin sed sagittis massa. Orci varius natoque penatibus et
      magnis dis parturient montes, nascetur ridiculus mus. Sed nec ante ipsum.
      In hac habitasse platea dictumst. Phasellus condimentum sapien non felis
      mattis scelerisque. Nam tempus tincidunt tortor eu ullamcorper. Donec
      libero sem, lobortis in enim dignissim, dictum condimentum tortor. Morbi
      laoreet orci lorem, et scelerisque tortor facilisis in. In egestas ex at
      ultricies dictum. Donec feugiat eu orci non lacinia. Nulla faucibus diam
      quis ultricies viverra. Nulla facilisi. Class aptent taciti sociosqu ad
      litora torquent per conubia nostra, per inceptos himenaeos. Quisque mollis
      finibus imperdiet. Pellentesque tristique ornare ligula ac hendrerit.
      Fusce erat nisi, fringilla in magna ut, faucibus pharetra sapien. Etiam
      metus nulla, laoreet et dignissim ac, laoreet in lorem. Aliquam erat
      volutpat. Sed vitae lorem sollicitudin, pretium orci ut, tristique ante.
      Fusce bibendum rhoncus ex, vitae eleifend dolor condimentum sit amet.
      Etiam vel dolor a ante feugiat consequat id viverra dui. Morbi placerat
      auctor libero nec feugiat. Phasellus a sapien risus. Sed justo quam,
      pellentesque et nisl eget, aliquet imperdiet nisl. Maecenas diam quam,
      malesuada sed varius vitae, viverra sit amet nisi. Vestibulum nec semper
      dui, non dictum ligula. Praesent fringilla arcu nec nisl tincidunt, vitae
      aliquam nulla posuere. Fusce nec ipsum turpis. Nullam imperdiet tortor
      vitae gravida porttitor. Donec vitae leo non orci aliquet semper. Aliquam
      euismod a ante ac hendrerit. Maecenas varius ex quis lorem placerat
      pellentesque. In tellus diam, lacinia a enim vel, tincidunt finibus mi.
      Duis mi velit, tincidunt in rhoncus nec, semper at nunc. Maecenas auctor
      varius nisi, vel molestie dui iaculis ac. Vestibulum ante ipsum primis in
      faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque ex
      massa, pellentesque sed pellentesque vel, tempor et dolor. Proin id
      eleifend ligula. Aliquam tempor nibh vitae magna pellentesque, non commodo
      quam ultricies. Nunc vel lorem sed urna blandit imperdiet nec a nibh.
      Praesent congue vehicula sagittis. Maecenas convallis auctor nunc, at
      dignissim neque ultrices at. Morbi fringilla tempor dui, eu pellentesque
      magna. Fusce in tellus efficitur, mattis lorem quis, malesuada tortor.
      Phasellus accumsan posuere nunc, a ornare ex posuere id. Cras scelerisque,
      dui eu consectetur suscipit, ipsum mi porta nunc, sodales lobortis tortor
      purus non velit. Sed nisl magna, tempor et nulla quis, sagittis interdum
      velit. Vivamus hendrerit purus nisl, venenatis feugiat nibh tincidunt vel.
      Etiam sit amet accumsan nulla. Vivamus in congue nisl, ac molestie ex.
    </Modal>
  );
};

const mapState = (state) => ({});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(TermsModal);
