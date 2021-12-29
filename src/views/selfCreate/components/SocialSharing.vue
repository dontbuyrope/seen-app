<template>
  <slot></slot>
  <div class="wrapme">
    <div class="relative">
      <div v-if="visibilityOfSocialSharing" class="dropup absolute rounded-md shadow-lg w-40" :class="darkMode ? 'dark-mode-surface dark-mode-text' : 'light-mode-surface text-gray-700'">
        <div class="py-4">
          <a :href="twitterUrl" @click="setVisibility(false)" target="_blank" class="block py-2 text-sm"><i class="mx-4 fab fa-twitter"></i>Twitter</a>
          <a :href="facebookUrl" @click="setVisibility(false)" target="_blank" class="block py-2 text-sm"><i class="mx-4 fab fa-facebook"></i>Facebook</a>
          <a :href="pinterestUrl" @click="setVisibility(false)" target="_blank" class="block py-2 text-sm"><i class="mx-4 fab fa-pinterest"></i>Pinterest</a>
          <span @click="() => {staticCopy(socialSharingUrl); setVisibility(false)}" class="cursor-pointer block py-2 text-sm"><i class="mx-4 fas fa-link"></i>Copy URL</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useCopyClipboard from "@/hooks/useCopyClipboard";
import useDarkMode from '@/hooks/useDarkMode';

export default {
  name: "SelfCreateSocialSharing",
  props: {
    socialSharingUrl: String,
    visibilityOfSocialSharing: Boolean,
    setVisibilityOfSocialSharing: Function,
  },
  setup(props) {
    const { darkMode } = useDarkMode();
    const { staticCopy } = useCopyClipboard();

    const twitterUrl = "https://twitter.com/intent/tweet?text=" + (props.socialSharingUrl || window.location.href);
    const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + (props.socialSharingUrl || window.location.href);
    const pinterestUrl = "https://pinterest.com/pin/create/button/?url=" + (props.socialSharingUrl || window.location.href);

    const setVisibility = (_visibility) => {
      props.setVisibilityOfSocialSharing(_visibility);
    }

    return {
      darkMode,
      staticCopy,
      setVisibility,
      twitterUrl,
      facebookUrl,
      pinterestUrl,
    }
  }
};
</script>

<style>
.dropup {
  top: -190px;
  left: -18px;
  z-index: 100;
}
.white {
  background-color: white;
  color: black;
}
.wrapme {
  position: relative;
  float: right;
  transform: translateY(-50%);
}
</style>
