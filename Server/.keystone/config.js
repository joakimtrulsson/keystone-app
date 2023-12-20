"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core15 = require("@keystone-6/core");
var import_session = require("@keystone-6/core/session");
var import_auth = require("@keystone-6/auth");
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));

// schemas/userSchema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// access.ts
function isSignedIn({ session }) {
  return Boolean(session);
}
var permissions = {
  canCreateItems: ({ session }) => session?.data.role?.canCreateItems ?? false,
  canManageAllItems: ({ session }) => session?.data.role?.canManageAllItems ?? false,
  canManageUsers: ({ session }) => session?.data.role?.canManageUsers ?? false,
  canManageRoles: ({ session }) => session?.data.role?.canManageRoles ?? false
};
var rules = {
  canReadItems: ({ session }) => {
    if (!session)
      return true;
    if (session.data.role?.canManageAllItems) {
      return true;
    }
    return { author: { id: { equals: session.itemId } } };
  },
  canManageItems: ({ session }) => {
    if (!session)
      return false;
    if (session.data.role?.canManageAllItems)
      return true;
    return { author: { id: { equals: session.itemId } } };
  },
  canReadUsers: ({ session }) => {
    if (!session)
      return false;
    if (session.data.role?.canSeeOtherUsers)
      return true;
    return { id: { equals: session.itemId } };
  },
  canUpdateUsers: ({ session }) => {
    if (!session)
      return false;
    if (session.data.role?.canEditOtherUsers)
      return true;
    return { id: { equals: session.itemId } };
  }
};

// schemas/userSchema.ts
var userSchema = (0, import_core.list)({
  access: {
    operation: {
      ...(0, import_access.allOperations)(isSignedIn),
      create: permissions.canManageUsers,
      delete: permissions.canManageUsers
    },
    filter: {
      query: rules.canReadUsers,
      update: rules.canUpdateUsers
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    listView: {
      initialColumns: ["name", "role"]
    },
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canEditOtherUsers)
          return "edit";
        if (session?.itemId === item.id)
          return "edit";
        return "read";
      }
    }
  },
  fields: {
    //   isIndexed ser till att namnet är unikt
    name: (0, import_fields.text)({
      isFilterable: false,
      isOrderable: false,
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    password: (0, import_fields.password)({
      access: {
        read: import_access.denyAll,
        // Event: is this required?
        update: ({ session, item }) => permissions.canManageUsers({ session }) || session?.itemId === item.id
      },
      validation: { isRequired: true }
    }),
    //  Rolen som är kopplad till användare.
    role: (0, import_fields.relationship)({
      ref: "Role.author",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      },
      ui: {
        itemView: {
          fieldMode: (args) => permissions.canManageUsers(args) ? "edit" : "read"
        }
      }
    }),
    //  item som är kopplad till användare.
    events: (0, import_fields.relationship)({
      ref: "Event.author",
      many: true,
      access: {
        // Endast med canManagaAllItems kan använda det här fältet åt andra användare.
        create: permissions.canManageAllItems,
        // Du kan endast uppdatera det här fältet med canMangageAllItems eller för dig själv.
        update: ({ session, item }) => permissions.canManageAllItems({ session }) || session?.itemId === item.id
      },
      ui: {
        createView: {
          // Du kan endast se edit view om du har canManageAllItems
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: { fieldMode: "read" }
      }
    }),
    posts: (0, import_fields.relationship)({
      ref: "Post.author",
      many: true,
      access: {
        // Du kan bara använda det här fältet om du har canMangaAllItems när du skapar en användare.
        create: permissions.canManageAllItems,
        // Du kan bara uppdatera det här fältet med canManageAllItems eller din egna användare.
        update: ({ session, item }) => permissions.canManageAllItems({ session }) || session?.itemId === item.id
      },
      ui: {
        createView: {
          // Du kan bara se createview om du har canManageAllItems
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: { fieldMode: "read" }
      }
    }),
    images: (0, import_fields.relationship)({
      ref: "Image.author",
      many: true,
      access: {
        // Du kan bara använda det här fältet om du har canMangaAllItems när du skapar en användare.
        create: permissions.canManageAllItems,
        // Du kan bara uppdatera det här fältet med canManageAllItems eller din egna användare.
        update: ({ session, item }) => permissions.canManageAllItems({ session }) || session?.itemId === item.id
      },
      ui: {
        createView: {
          // Du kan bara se createview om du har canManageAllItems
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: { fieldMode: "read" }
      }
    }),
    chapters: (0, import_fields.relationship)({
      ref: "Chapter.author",
      many: true,
      access: {
        create: permissions.canManageAllItems,
        update: ({ session, item }) => permissions.canManageAllItems({ session }) || session?.itemId === item.id
      },
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// schemas/eventSchema.ts
var import_core2 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var eventSchema = (0, import_core2.list)({
  access: {
    operation: {
      ...(0, import_access3.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateItems(args),
    listView: {
      initialColumns: ["title", "chapter", "author"]
    }
  },
  fields: {
    title: (0, import_fields2.text)({ validation: { isRequired: true } }),
    chapter: (0, import_fields2.relationship)({
      ref: "Chapter.events",
      many: true
    }),
    content: (0, import_fields_document.document)({
      formatting: true,
      dividers: true,
      links: true,
      layouts: [
        [1, 1],
        [1, 1, 1]
      ]
    }),
    slug: (0, import_fields2.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    eventImg: (0, import_fields2.image)({ storage: "eventImages" }),
    eventStartDate: (0, import_fields2.timestamp)(),
    author: (0, import_fields2.relationship)({
      ref: "User.events",
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === "create" && !resolvedData.author && context.session) {
            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        }
      }
    })
  }
});

// schemas/chapterSchema.ts
var import_core3 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var chapterSchema = (0, import_core3.list)({
  access: {
    operation: {
      ...(0, import_access5.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateItems(args),
    listView: {
      initialColumns: ["title", "author"]
    }
  },
  fields: {
    title: (0, import_fields3.text)({ validation: { isRequired: true } }),
    desc: (0, import_fields3.text)({ validation: { isRequired: true } }),
    heroImage: (0, import_fields3.image)({ storage: "heroImages" }),
    referencedChapter: (0, import_fields3.relationship)({
      ref: "Chapter",
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      }
    }),
    events: (0, import_fields3.relationship)({
      ref: "Event.chapter",
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          return resolvedData.events;
        }
      }
    }),
    // sections: relationship({
    //   ref: 'Section',
    //   many: true,
    //   ui: {
    //     createView: {
    //       fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'hidden'),
    //     },
    //     itemView: {
    //       fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'read'),
    //     },
    //   },
    // }),
    sections: (0, import_fields3.json)({
      ui: {
        views: "./fields/sections/main",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    author: (0, import_fields3.relationship)({
      ref: "User.chapters",
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === "create" && !resolvedData.author && context.session) {
            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        }
      }
    })
    // slugTest: {
    //   // type: Virtual,
    //   resolver: item => `${item.name}-${item.id}`
    //   }
    // },
    // slug: text({
    //   // Being a slug, it should be indexed for lookups and unique
    //   // isIndexed: 'unique',
    //   // Define the hook function itself and attach it to the resolveInput
    //   // step of the mutation lifecycle
    //   hooks: {
    //     resolveInput: ({ operation, resolvedData, inputData }) => {
    //       // Lets only default the slug value on create and only if
    //       // it isn't supplied by the caller.
    //       // We probably don't want slugs to change automatically if an
    //       // item is renamed.
    //       console.log(resolvedData);
    //       if (operation === 'update' && !inputData.slug) {
    //         return buildSlug(inputData.title);
    //       }
    //       // Since this hook is a the field level we only return the
    //       // value for this field, not the whole item
    //       return resolvedData.slug;
    //     },
    //   },
    // }),
  }
});

// schemas/postSchema.ts
var import_core9 = require("@keystone-6/core");
var import_access7 = require("@keystone-6/core/access");
var import_fields4 = require("@keystone-6/core/fields");
var import_fields_document2 = require("@keystone-6/fields-document");

// component-blocks/index.tsx
var import_component_blocks3 = require("@keystone-6/fields-document/component-blocks");

// component-blocks/ImageUploader/index.tsx
var import_core5 = require("@keystone-ui/core");

// component-blocks/ImageUploader/styles.ts
var import_core4 = require("@keystone-ui/core");
var container = (mode = "preview") => import_core4.css`
  display: block;

  ${mode === "preview" && import_core4.css`
    padding: 16px;
    border: 1px dotted #e2e8f0;
    border-radius: 8px;
  `}
`;
var inputWrapper = import_core4.css`
  display: flex;
  align-items: center;
  margin-top: 16px;

  label {
    font-weight: 500;
    margin-right: 8px;
  }
`;
var textInput = import_core4.css`
  width: 100%;
  max-width: 450px;
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #334155;
  transition: border-color 0.1s ease-in;

  &:hover {
    border-color: #93c5fd;
  }

  &:focus {
    border-color: #3b82f6;
  }
`;
var imageUploader = (isUploaded) => import_core4.css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease-in;

  ${isUploaded && import_core4.css`
    justify-content: flex-start;
    height: auto;
    border: 0;
  `}

  &:hover {
    color: #3b82f6;
    border-color: #93c5fd;
  }

  &:focus {
    border-color: #3b82f6;
  }
`;
var imagePreview = import_core4.css`
  width: auto;
  height: auto;
  max-width: 100%;
  cursor: pointer;
`;
var styles_default = {
  container,
  inputWrapper,
  textInput,
  imageUploader,
  imagePreview
};

// component-blocks/ImageUploader/useBase.tsx
var import_react = require("react");
var import_apollo = require("@keystone-6/core/admin-ui/apollo");
var import_context = require("@keystone-6/core/admin-ui/context");
var import_toast = require("@keystone-ui/toast");
var useBase = ({
  listKey,
  defaultValue,
  imageAlt,
  onChange,
  onImageAltChange,
  onRelationChange
}) => {
  const [altText, setAltText] = (0, import_react.useState)(imageAlt ?? "");
  const [imageSrc, setImageSrc] = (0, import_react.useState)(defaultValue?.image?.url ?? "");
  const list10 = (0, import_context.useList)(listKey);
  const toasts = (0, import_toast.useToasts)();
  const UPLOAD_IMAGE = import_apollo.gql`
    mutation ${list10.gqlNames.createMutationName}($file: Upload!) {
      ${list10.gqlNames.createMutationName}(data: { image: { upload: $file } }) {
        id, name, type, image { id, extension, filesize, height, width, url }
      }
    }
  `;
  const [uploadImage, { loading }] = (0, import_apollo.useMutation)(UPLOAD_IMAGE);
  const uploadFile = (0, import_react.useCallback)(
    async (file) => {
      try {
        return await uploadImage({
          variables: { file }
        });
      } catch (err) {
        toasts.addToast({
          title: `Failed to upload file: ${file.name}`,
          tone: "negative",
          message: err.message
        });
      }
      return null;
    },
    [toasts, uploadImage]
  );
  const handleAltTextChange = (0, import_react.useCallback)(
    async (e) => {
      const { value } = e.currentTarget;
      setAltText(value);
      onImageAltChange?.(value);
    },
    [onImageAltChange]
  );
  const handleUploadChange = (0, import_react.useCallback)(
    async (e) => {
      const selectedFile = e.currentTarget.files?.[0];
      const src = selectedFile ? URL.createObjectURL(selectedFile) : "";
      setImageSrc(src);
      if (selectedFile) {
        const result = await uploadFile(selectedFile);
        const uploadedImage = result?.data?.createImage;
        onChange?.({ id: uploadedImage.id });
        if (onRelationChange) {
          setTimeout(
            () => onRelationChange({
              id: uploadedImage.id,
              label: uploadedImage.name,
              data: uploadedImage
            }),
            0
          );
        }
      }
    },
    [onChange, onRelationChange]
  );
  return {
    altText,
    imageSrc,
    loading,
    isShowLabel: !loading && !imageSrc,
    isShowImage: !loading && !!imageSrc,
    handleAltTextChange,
    handleUploadChange
  };
};
var useBase_default = useBase;

// component-blocks/ImageUploader/index.tsx
var ImageUploader = (props) => {
  const {
    altText,
    imageSrc,
    loading,
    isShowLabel,
    isShowImage,
    handleAltTextChange,
    handleUploadChange
  } = useBase_default(props);
  const { mode } = props;
  return /* @__PURE__ */ (0, import_core5.jsx)("div", { css: styles_default.container(mode) }, /* @__PURE__ */ (0, import_core5.jsx)("label", { id: "file", css: styles_default.imageUploader(isShowImage) }, isShowLabel && /* @__PURE__ */ (0, import_core5.jsx)("span", null, "\u{1F5B1} Click to select a file..."), loading && /* @__PURE__ */ (0, import_core5.jsx)("span", null, "Loading..."), /* @__PURE__ */ (0, import_core5.jsx)(
    "input",
    {
      autoComplete: "off",
      type: "file",
      accept: "image/*",
      style: { display: "none" },
      onChange: handleUploadChange
    }
  ), /* @__PURE__ */ (0, import_core5.jsx)(
    "img",
    {
      src: imageSrc,
      alt: altText,
      css: styles_default.imagePreview,
      style: { display: isShowImage ? "block" : "none" }
    }
  )), mode === "preview" && /* @__PURE__ */ (0, import_core5.jsx)("div", { css: styles_default.inputWrapper }, /* @__PURE__ */ (0, import_core5.jsx)("label", null, "Image Alt:"), /* @__PURE__ */ (0, import_core5.jsx)(
    "input",
    {
      type: "text",
      placeholder: "",
      css: styles_default.textInput,
      value: altText,
      onChange: handleAltTextChange
    }
  )));
};
ImageUploader.defaultProps = {
  defaultValue: null,
  imageAlt: "",
  mode: "preview"
};

// component-blocks/document-fields.tsx
var import_react2 = __toESM(require("react"));
var image3 = ({
  listKey
}) => {
  return {
    kind: "form",
    Input({ value, onChange }) {
      return /* @__PURE__ */ import_react2.default.createElement(
        ImageUploader,
        {
          listKey,
          defaultValue: value,
          mode: "edit",
          onChange
        }
      );
    },
    options: { listKey },
    defaultValue: null,
    validate(value) {
      return typeof value === "object";
    }
  };
};

// component-blocks/carousel.tsx
var import_core6 = require("@keystone-ui/core");
var import_component_blocks = require("@keystone-6/fields-document/component-blocks");
var carousel = (0, import_component_blocks.component)({
  label: "Carousel",
  preview: function Preview(props) {
    return /* @__PURE__ */ (0, import_core6.jsx)(import_component_blocks.NotEditable, null, /* @__PURE__ */ (0, import_core6.jsx)(
      "div",
      {
        css: {
          overflowY: "scroll",
          display: "flex",
          scrollSnapType: "y mandatory"
        }
      },
      props.fields.items.elements.map((item) => {
        return /* @__PURE__ */ (0, import_core6.jsx)(
          import_core6.Box,
          {
            key: item.key,
            margin: "xsmall",
            css: {
              minWidth: "61.8%",
              scrollSnapAlign: "center",
              scrollSnapStop: "always",
              margin: 4,
              padding: 8,
              boxSizing: "border-box",
              borderRadius: 6,
              background: "#eff3f6"
            }
          },
          /* @__PURE__ */ (0, import_core6.jsx)(
            "img",
            {
              role: "presentation",
              src: item.fields.imageSrc.value,
              css: {
                objectFit: "cover",
                objectPosition: "center center",
                height: 240,
                width: "100%",
                borderRadius: 4
              }
            }
          ),
          /* @__PURE__ */ (0, import_core6.jsx)(
            "h1",
            {
              css: {
                "&&": {
                  fontSize: "1.25rem",
                  lineHeight: "unset",
                  marginTop: 8
                }
              }
            },
            item.fields.title.value
          )
        );
      })
    ));
  },
  schema: {
    items: import_component_blocks.fields.array(
      import_component_blocks.fields.object({
        title: import_component_blocks.fields.text({ label: "Title" }),
        imageSrc: import_component_blocks.fields.url({
          label: "Image URL",
          defaultValue: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
        })
      })
    )
  }
});

// component-blocks/hero.tsx
var import_core7 = require("@keystone-ui/core");
var import_component_blocks2 = require("@keystone-6/fields-document/component-blocks");
var hero = (0, import_component_blocks2.component)({
  label: "Hero",
  schema: {
    imageSrc: import_component_blocks2.fields.text({
      label: "Image URL",
      defaultValue: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
    }),
    caption: import_component_blocks2.fields.conditional(import_component_blocks2.fields.checkbox({ label: "Has caption" }), {
      false: import_component_blocks2.fields.empty(),
      true: import_component_blocks2.fields.child({
        kind: "block",
        placeholder: "Write a caption...",
        formatting: "inherit",
        links: "inherit"
      })
    })
  },
  preview: function Hero(props) {
    return /* @__PURE__ */ (0, import_core7.jsx)("div", null, /* @__PURE__ */ (0, import_core7.jsx)(import_component_blocks2.NotEditable, null, /* @__PURE__ */ (0, import_core7.jsx)(
      "div",
      {
        css: {
          backgroundImage: `url(${props.fields.imageSrc.value})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: 200,
          width: "100%"
        }
      }
    )), props.fields.caption.discriminant ? /* @__PURE__ */ (0, import_core7.jsx)("div", { css: { textAlign: "center" } }, props.fields.caption.value.element) : null);
  }
});

// component-blocks/index.tsx
var import_core8 = require("@keystone-ui/core");
var componentBlocks = {
  carousel,
  hero,
  /** Image */
  image: (0, import_component_blocks3.component)({
    preview: ({ fields: fields4 }) => /* @__PURE__ */ (0, import_core8.jsx)(import_component_blocks3.NotEditable, null, /* @__PURE__ */ (0, import_core8.jsx)(
      ImageUploader,
      {
        listKey: fields4.image.options.listKey,
        defaultValue: fields4.imageRel.value?.data,
        imageAlt: fields4.imageAlt.value,
        onChange: fields4.image.onChange,
        onImageAltChange: fields4.imageAlt.onChange,
        onRelationChange: fields4.imageRel.onChange
      }
    )),
    label: "Image",
    schema: {
      imageAlt: import_component_blocks3.fields.text({
        label: "Image Alt",
        defaultValue: ""
      }),
      imageRel: import_component_blocks3.fields.relationship({
        listKey: "Image",
        label: "Image Relation",
        selection: "id, image { width, height, url }"
      }),
      image: image3({
        listKey: "Image"
      })
    },
    chromeless: true
  })
};

// schemas/postSchema.ts
var postSchema = (0, import_core9.list)({
  access: {
    operation: {
      ...(0, import_access7.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateItems(args),
    listView: {
      initialColumns: ["title", "author"]
    }
  },
  fields: {
    title: (0, import_fields4.text)({ validation: { isRequired: true } }),
    content: (0, import_fields_document2.document)({
      formatting: true,
      dividers: true,
      links: true,
      layouts: [
        [1, 1],
        [1, 1, 1]
      ],
      ui: {
        views: "./component-blocks"
      },
      componentBlocks
    }),
    slug: (0, import_fields4.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    postImage: (0, import_fields4.image)({ storage: "postImages" }),
    publishDate: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" }
    }),
    author: (0, import_fields4.relationship)({
      ref: "User.posts",
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === "create" && !resolvedData.author && context.session) {
            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        }
      }
    })
  }
});

// schemas/roleSchema.ts
var import_core10 = require("@keystone-6/core");
var import_access9 = require("@keystone-6/core/access");
var import_fields5 = require("@keystone-6/core/fields");
var roleSchema = (0, import_core10.list)({
  access: {
    operation: {
      ...(0, import_access9.allOperations)(permissions.canManageRoles),
      query: isSignedIn
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ["name", "author"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageRoles(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields5.text)({ validation: { isRequired: true } }),
    canCreateItems: (0, import_fields5.checkbox)({ defaultValue: false }),
    canManageAllItems: (0, import_fields5.checkbox)({ defaultValue: false }),
    canSeeOtherUsers: (0, import_fields5.checkbox)({ defaultValue: false }),
    canEditOtherUsers: (0, import_fields5.checkbox)({ defaultValue: false }),
    canManageUsers: (0, import_fields5.checkbox)({ defaultValue: false }),
    canManageRoles: (0, import_fields5.checkbox)({ defaultValue: false }),
    canUseAdminUI: (0, import_fields5.checkbox)({ defaultValue: false }),
    canReadChapters: (0, import_fields5.checkbox)({ defaultValue: false }),
    canReadImages: (0, import_fields5.checkbox)({ defaultValue: false }),
    author: (0, import_fields5.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// schemas/imageSchema.ts
var import_core11 = require("@keystone-6/core");
var import_access11 = require("@keystone-6/core/access");
var import_fields7 = require("@keystone-6/core/fields");

// component-blocks/ImageUploader/fields.tsx
var import_fields6 = require("@keystone-6/core/fields");
var imageStorageField = (0, import_fields6.image)({ storage: "heroImages" });
var imageAltField = (0, import_fields6.text)({
  defaultValue: "",
  validation: { length: { max: 255 } }
});

// schemas/imageSchema.ts
var imageSchema = (0, import_core11.list)({
  access: {
    operation: {
      ...(0, import_access11.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: rules.canReadItems,
      update: rules.canReadItems,
      // update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    listView: {
      initialColumns: ["name", "type", "image"],
      initialSort: { field: "name", direction: "ASC" }
    }
  },
  /** Image */
  fields: {
    name: (0, import_fields7.text)({ defaultValue: "" }),
    // Category, Page, Post, Document (from document editor)
    type: (0, import_fields7.text)({ defaultValue: "Document" /* DOCUMENT */ }),
    filename: (0, import_fields7.text)({
      isIndexed: "unique",
      db: { isNullable: true },
      ui: { createView: { fieldMode: "hidden" }, itemView: { fieldMode: "read" } }
    }),
    image: imageStorageField,
    author: (0, import_fields7.relationship)({
      ref: "User.images",
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === "create" && !resolvedData.author && context.session) {
            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        }
      }
    })
  },
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      const { name, image: image10 } = resolvedData;
      const imageId = image10.id ?? item?.image_id;
      const imageExt = image10.extension ?? item?.image_extension;
      const origFilename = typeof imageId === "string" ? imageId.split("-").slice(0, -1).join("-") : "unknown";
      const filename = imageId ? `${imageId}.${imageExt}` : null;
      if (name === "") {
        return {
          ...resolvedData,
          name: origFilename || item?.name,
          filename: filename || item?.filename
        };
      }
      return { ...resolvedData, filename };
    }
  }
});

// schemas/sectionSchema.ts
var import_core12 = require("@keystone-6/core");
var import_fields9 = require("@keystone-6/core/fields");
var import_access13 = require("@keystone-6/core/access");
var sectionSchema = (0, import_core12.list)({
  access: {
    operation: {
      ...(0, import_access13.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    // title: text({ validation: { isRequired: true } }),
    // text: text({ validation: { isRequired: true } }),
    // image: image({ storage: 'sectionImages' }),
    relatedLinks: (0, import_fields9.json)({
      ui: {
        views: "./fields/related-links/components",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    faq: (0, import_fields9.relationship)({
      ref: "Faq",
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      }
    }),
    teaser: (0, import_fields9.relationship)({
      ref: "Teaser",
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      }
    })
  }
});

// schemas/teaserSchema.ts
var import_core13 = require("@keystone-6/core");
var import_fields10 = require("@keystone-6/core/fields");
var import_access15 = require("@keystone-6/core/access");
var teaserSchema = (0, import_core13.list)({
  access: {
    operation: {
      ...(0, import_access15.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    text: (0, import_fields10.text)({ validation: { isRequired: true } }),
    url: (0, import_fields10.text)({ validation: { isRequired: true } }),
    image: (0, import_fields10.image)({ storage: "teaserImages" })
  }
});

// schemas/faqSchema.ts
var import_core14 = require("@keystone-6/core");
var import_fields11 = require("@keystone-6/core/fields");
var import_access17 = require("@keystone-6/core/access");
var faqSchema = (0, import_core14.list)({
  access: {
    operation: {
      ...(0, import_access17.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    question: (0, import_fields11.text)({ validation: { isRequired: true } }),
    answer: (0, import_fields11.text)({ validation: { isRequired: true } })
  }
});

// schema.ts
var lists = {
  Chapter: chapterSchema,
  Event: eventSchema,
  Post: postSchema,
  User: userSchema,
  Role: roleSchema,
  Image: imageSchema
  // Section,
  // Faq,
  // Teaser,
};

// routes/getEvents.ts
async function getEvents(req, res, context) {
  const events = await context.query.Event.findMany({
    // where: {
    //   isComplete,
    // },
    query: `
     id
     title
     content { document }
    `
  });
  res.json(events);
}

// routes/getPosts.ts
async function getPosts(req, res, context) {
  const posts = await context.query.Post.findMany({
    query: `
     id
     title
     content { document }
    `
  });
  res.json(posts);
}

// keystone.ts
import_dotenv.default.config();
var { ASSET_BASE_URL: baseUrl = "http://localhost:3000" } = process.env;
function withContext(commonContext, f) {
  return async (req, res) => {
    return f(req, res, await commonContext.withRequest(req, res));
  };
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  // Ett identity field på usern.
  identityField: "name",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "password"],
    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: "Admin Role",
          canCreateItems: true,
          canManageAllItems: true,
          canSeeOtherUsers: true,
          canEditOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true,
          canUseAdminUI: true
        }
      }
    }
  },
  sessionData: `
    name
    role {
      id
      name
      canCreateItems
      canManageAllItems
      canSeeOtherUsers
      canEditOtherUsers
      canManageUsers
      canManageRoles
      canUseAdminUI
    }`
});
var keystone_default = withAuth(
  (0, import_core15.config)({
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./database.db"
    },
    server: {
      cors: { origin: ["http://localhost:5173"], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.get("/api/events", withContext(commonContext, getEvents));
        app.get("/api/posts", withContext(commonContext, getPosts));
        app.use("/images", import_express.default.static("public/event-images"));
        app.use("/post-images", import_express.default.static("public/post-images"));
      }
    },
    lists,
    storage: {
      eventImages: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${baseUrl}/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/event-images"
      },
      heroImages: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${baseUrl}/hero-images${path}`,
        serverRoute: {
          path: "/hero-images"
        },
        storagePath: "public/hero-images"
      },
      postImages: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${baseUrl}/post-images${path}`,
        serverRoute: {
          path: "/post-images"
        },
        storagePath: "public/post-images"
      },
      sectionImages: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${baseUrl}/section-images${path}`,
        serverRoute: {
          path: "/section-images"
        },
        storagePath: "public/section-images"
      },
      teaserImages: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `${baseUrl}/teaser-images${path}`,
        serverRoute: {
          path: "/teaser-images"
        },
        storagePath: "public/teaser-images"
      }
    },
    ui: {
      isAccessAllowed: ({ session }) => {
        return session?.data.role?.canUseAdminUI ?? false;
      }
    },
    session: (0, import_session.statelessSessions)()
  })
);
//# sourceMappingURL=config.js.map
