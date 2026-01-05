--
-- PostgreSQL database dump
--

\restrict jZsquDVsmrQvHqGcb0u5O9uWLfZ21hNM8jQea9oRK52HjqhSaQnez4PjpfEIxgZ

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.about_sections (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    image character varying,
    reverse boolean,
    "order" integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    title_translations json,
    description_translations json
);


ALTER TABLE public.about_sections OWNER TO postgres;

--
-- Name: about_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.about_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_sections_id_seq OWNER TO postgres;

--
-- Name: about_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.about_sections_id_seq OWNED BY public.about_sections.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    variant_id integer,
    quantity integer NOT NULL,
    size character varying,
    price double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    gender character varying,
    image character varying,
    parent_id integer,
    "order" integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    title_translations json,
    show_on_homepage boolean DEFAULT false
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    message text NOT NULL,
    admin_reply text,
    is_read boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_messages_id_seq OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: contact_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_info (
    id integer NOT NULL,
    icon_type character varying NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL,
    details character varying,
    "order" integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    title_translations json,
    content_translations json
);


ALTER TABLE public.contact_info OWNER TO postgres;

--
-- Name: contact_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_info_id_seq OWNER TO postgres;

--
-- Name: contact_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_info_id_seq OWNED BY public.contact_info.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    subject character varying,
    message text NOT NULL,
    is_read boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: faq_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faq_items (
    id integer NOT NULL,
    question character varying NOT NULL,
    answer text NOT NULL,
    "order" integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    question_translations json,
    answer_translations json
);


ALTER TABLE public.faq_items OWNER TO postgres;

--
-- Name: faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faq_items_id_seq OWNER TO postgres;

--
-- Name: faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faq_items_id_seq OWNED BY public.faq_items.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    variant_id integer,
    quantity integer NOT NULL,
    size character varying,
    price double precision NOT NULL,
    total_price double precision NOT NULL,
    product_data json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_amount double precision NOT NULL,
    discount_amount double precision,
    payment_method character varying NOT NULL,
    payment_status character varying,
    order_status character varying,
    address text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name character varying NOT NULL,
    logo_url character varying NOT NULL,
    website_url character varying,
    "order" integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.partners OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partners_id_seq OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: payme_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payme_transactions (
    id integer NOT NULL,
    payme_transaction_id character varying NOT NULL,
    merchant_transaction_id character varying,
    user_id integer NOT NULL,
    order_id integer,
    amount bigint NOT NULL,
    state integer,
    reason integer,
    create_time bigint NOT NULL,
    perform_time bigint,
    cancel_time bigint,
    account json,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.payme_transactions OWNER TO postgres;

--
-- Name: payme_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payme_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payme_transactions_id_seq OWNER TO postgres;

--
-- Name: payme_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payme_transactions_id_seq OWNED BY public.payme_transactions.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    variant_id integer NOT NULL,
    image_url character varying NOT NULL,
    "order" integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer NOT NULL,
    color_name character varying NOT NULL,
    color_image character varying,
    price double precision NOT NULL,
    stock integer,
    size_stock json,
    sizes json,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variants_id_seq OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    category_id integer NOT NULL,
    stock integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    is_active boolean,
    description_title text,
    material text,
    branding text,
    packaging text,
    size_guide text,
    delivery_info text,
    return_info text,
    exchange_info text,
    name_translations json,
    description_translations json,
    description_title_translations json,
    material_translations json,
    branding_translations json,
    packaging_translations json,
    size_guide_translations json,
    delivery_info_translations json,
    return_info_translations json,
    exchange_info_translations json
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    value text,
    description character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO postgres;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: slider_slides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.slider_slides (
    id integer NOT NULL,
    title character varying,
    link character varying,
    image_url_desktop character varying NOT NULL,
    image_url_mobile character varying,
    alt_text character varying,
    "order" integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.slider_slides OWNER TO postgres;

--
-- Name: slider_slides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.slider_slides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slider_slides_id_seq OWNER TO postgres;

--
-- Name: slider_slides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.slider_slides_id_seq OWNED BY public.slider_slides.id;


--
-- Name: social_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_links (
    id integer NOT NULL,
    links json,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.social_links OWNER TO postgres;

--
-- Name: social_links_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_links_id_seq OWNER TO postgres;

--
-- Name: social_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_links_id_seq OWNED BY public.social_links.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL,
    image character varying,
    "order" integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    name_translations json,
    role_translations json
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_seq OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    state character varying,
    address character varying,
    pincode character varying,
    city character varying,
    is_email_verified boolean,
    verification_code character varying,
    verification_code_expires timestamp without time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    is_active boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: about_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_sections ALTER COLUMN id SET DEFAULT nextval('public.about_sections_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: contact_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info ALTER COLUMN id SET DEFAULT nextval('public.contact_info_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: faq_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faq_items ALTER COLUMN id SET DEFAULT nextval('public.faq_items_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: payme_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payme_transactions ALTER COLUMN id SET DEFAULT nextval('public.payme_transactions_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: slider_slides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slider_slides ALTER COLUMN id SET DEFAULT nextval('public.slider_slides_id_seq'::regclass);


--
-- Name: social_links id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links ALTER COLUMN id SET DEFAULT nextval('public.social_links_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: about_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.about_sections (id, title, description, image, reverse, "order", created_at, updated_at, title_translations, description_translations) FROM stdin;
4	О бренде Liberty	О бренде LIBERTY LIBERTY — это современный бренд одежды, созданный ООО «YUSTEX», который с 2022 года стал одним из самых востребованных и быстроразвивающихся брендов в Узбекистане. Основная цель бренда — создавать удобную, современную и высококачественную трикотажную одежду для людей всех возрастов. LIBERTY гармонично сочетает современные модные тенденции с национальной культурой производства, благодаря чему занимает уникальное место на рынке. Одной из ключевых особенностей бренда LIBERTY является строгий подход к качеству и использование натуральных тканей.	https://libertywear.uz/api/uploads/images/0fe7738a-dc3f-4f32-a611-bd2b7a48eb8f.jpg	t	1	2025-12-26 13:53:03.529817+00	2025-12-27 13:20:18.793476+00	{"ru": "\\u041e \\u0431\\u0440\\u0435\\u043d\\u0434\\u0435 Liberty", "uz": "Liberty brendi haqida", "en": "About Liberty Brand", "es": "Acerca de la marca Liberty"}	{"ru": "\\u041e \\u0431\\u0440\\u0435\\u043d\\u0434\\u0435 LIBERTY LIBERTY \\u2014 \\u044d\\u0442\\u043e \\u0441\\u043e\\u0432\\u0440\\u0435\\u043c\\u0435\\u043d\\u043d\\u044b\\u0439 \\u0431\\u0440\\u0435\\u043d\\u0434 \\u043e\\u0434\\u0435\\u0436\\u0434\\u044b, \\u0441\\u043e\\u0437\\u0434\\u0430\\u043d\\u043d\\u044b\\u0439 \\u041e\\u041e\\u041e \\u00abYUSTEX\\u00bb, \\u043a\\u043e\\u0442\\u043e\\u0440\\u044b\\u0439 \\u0441 2022 \\u0433\\u043e\\u0434\\u0430 \\u0441\\u0442\\u0430\\u043b \\u043e\\u0434\\u043d\\u0438\\u043c \\u0438\\u0437 \\u0441\\u0430\\u043c\\u044b\\u0445 \\u0432\\u043e\\u0441\\u0442\\u0440\\u0435\\u0431\\u043e\\u0432\\u0430\\u043d\\u043d\\u044b\\u0445 \\u0438 \\u0431\\u044b\\u0441\\u0442\\u0440\\u043e\\u0440\\u0430\\u0437\\u0432\\u0438\\u0432\\u0430\\u044e\\u0449\\u0438\\u0445\\u0441\\u044f \\u0431\\u0440\\u0435\\u043d\\u0434\\u043e\\u0432 \\u0432 \\u0423\\u0437\\u0431\\u0435\\u043a\\u0438\\u0441\\u0442\\u0430\\u043d\\u0435. \\u041e\\u0441\\u043d\\u043e\\u0432\\u043d\\u0430\\u044f \\u0446\\u0435\\u043b\\u044c \\u0431\\u0440\\u0435\\u043d\\u0434\\u0430 \\u2014 \\u0441\\u043e\\u0437\\u0434\\u0430\\u0432\\u0430\\u0442\\u044c \\u0443\\u0434\\u043e\\u0431\\u043d\\u0443\\u044e, \\u0441\\u043e\\u0432\\u0440\\u0435\\u043c\\u0435\\u043d\\u043d\\u0443\\u044e \\u0438 \\u0432\\u044b\\u0441\\u043e\\u043a\\u043e\\u043a\\u0430\\u0447\\u0435\\u0441\\u0442\\u0432\\u0435\\u043d\\u043d\\u0443\\u044e \\u0442\\u0440\\u0438\\u043a\\u043e\\u0442\\u0430\\u0436\\u043d\\u0443\\u044e \\u043e\\u0434\\u0435\\u0436\\u0434\\u0443 \\u0434\\u043b\\u044f \\u043b\\u044e\\u0434\\u0435\\u0439 \\u0432\\u0441\\u0435\\u0445 \\u0432\\u043e\\u0437\\u0440\\u0430\\u0441\\u0442\\u043e\\u0432. LIBERTY \\u0433\\u0430\\u0440\\u043c\\u043e\\u043d\\u0438\\u0447\\u043d\\u043e \\u0441\\u043e\\u0447\\u0435\\u0442\\u0430\\u0435\\u0442 \\u0441\\u043e\\u0432\\u0440\\u0435\\u043c\\u0435\\u043d\\u043d\\u044b\\u0435 \\u043c\\u043e\\u0434\\u043d\\u044b\\u0435 \\u0442\\u0435\\u043d\\u0434\\u0435\\u043d\\u0446\\u0438\\u0438 \\u0441 \\u043d\\u0430\\u0446\\u0438\\u043e\\u043d\\u0430\\u043b\\u044c\\u043d\\u043e\\u0439 \\u043a\\u0443\\u043b\\u044c\\u0442\\u0443\\u0440\\u043e\\u0439 \\u043f\\u0440\\u043e\\u0438\\u0437\\u0432\\u043e\\u0434\\u0441\\u0442\\u0432\\u0430, \\u0431\\u043b\\u0430\\u0433\\u043e\\u0434\\u0430\\u0440\\u044f \\u0447\\u0435\\u043c\\u0443 \\u0437\\u0430\\u043d\\u0438\\u043c\\u0430\\u0435\\u0442 \\u0443\\u043d\\u0438\\u043a\\u0430\\u043b\\u044c\\u043d\\u043e\\u0435 \\u043c\\u0435\\u0441\\u0442\\u043e \\u043d\\u0430 \\u0440\\u044b\\u043d\\u043a\\u0435. \\u041e\\u0434\\u043d\\u043e\\u0439 \\u0438\\u0437 \\u043a\\u043b\\u044e\\u0447\\u0435\\u0432\\u044b\\u0445 \\u043e\\u0441\\u043e\\u0431\\u0435\\u043d\\u043d\\u043e\\u0441\\u0442\\u0435\\u0439 \\u0431\\u0440\\u0435\\u043d\\u0434\\u0430 LIBERTY \\u044f\\u0432\\u043b\\u044f\\u0435\\u0442\\u0441\\u044f \\u0441\\u0442\\u0440\\u043e\\u0433\\u0438\\u0439 \\u043f\\u043e\\u0434\\u0445\\u043e\\u0434 \\u043a \\u043a\\u0430\\u0447\\u0435\\u0441\\u0442\\u0432\\u0443 \\u0438 \\u0438\\u0441\\u043f\\u043e\\u043b\\u044c\\u0437\\u043e\\u0432\\u0430\\u043d\\u0438\\u0435 \\u043d\\u0430\\u0442\\u0443\\u0440\\u0430\\u043b\\u044c\\u043d\\u044b\\u0445 \\u0442\\u043a\\u0430\\u043d\\u0435\\u0439.", "uz": "LIBERTY brendi haqida LIBERTY \\u2014 bu 2022 yildan beri O'zbekistonda eng talabgir va tez rivojlanayotgan brendlardan biriga aylangan \\u00abYUSTEX\\u00bb MChJ tomonidan yaratilgan zamonaviy kiyim brendi. Brendning asosiy maqsadi \\u2014 barcha yoshdagi odamlar uchun qulay, zamonaviy va yuqori sifatli trikotaj kiyimlar yaratishdir. LIBERTY zamonaviy moda tendentsiyalarini milliy ishlab chiqarish madaniyati bilan uyg'unlashtirib, bozorda noyob o'rinni egallaydi. LIBERTY brendining asosiy xususiyatlaridan biri sifatga qat'iy yondashuv va tabiiy matolardan foydalanishdir.", "en": "About LIBERTY Brand LIBERTY is a modern clothing brand created by YUSTEX LLC, which since 2022 has become one of the most in-demand and rapidly developing brands in Uzbekistan. The main goal of the brand is to create comfortable, modern, and high-quality knitwear for people of all ages. LIBERTY harmoniously combines modern fashion trends with national production culture, which allows it to occupy a unique place in the market. One of the key features of the LIBERTY brand is a strict approach to quality and the use of natural fabrics.", "es": "Acerca de la marca LIBERTY LIBERTY es una marca de ropa moderna creada por YUSTEX LLC, que desde 2022 se ha convertido en una de las marcas m\\u00e1s demandadas y de r\\u00e1pido desarrollo en Uzbekist\\u00e1n. El objetivo principal de la marca es crear ropa de punto c\\u00f3moda, moderna y de alta calidad para personas de todas las edades. LIBERTY combina armoniosamente las tendencias de moda modernas con la cultura de producci\\u00f3n nacional, lo que le permite ocupar un lugar \\u00fanico en el mercado. Una de las caracter\\u00edsticas clave de la marca LIBERTY es un enfoque estricto de la calidad y el uso de telas naturales."}
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, user_id, product_id, variant_id, quantity, size, price, created_at, updated_at) FROM stdin;
3	3	12	\N	1	M	300000	2025-12-15 07:34:06.090964+00	2025-12-20 23:27:32.616177+00
2	3	10	\N	1	M	370000	2025-12-15 07:32:44.778559+00	2025-12-20 23:27:47.323046+00
14	1	42	78	1	M	500000	2025-12-26 13:13:19.912816+00	\N
15	6	34	58	1	M	370000	2025-12-28 17:12:05.439106+00	\N
17	6	30	\N	1	M	120000	2025-12-29 06:44:04.538669+00	2025-12-29 07:20:53.257523+00
18	3	35	54	1	M	370000	2025-12-29 19:13:01.832892+00	\N
19	3	34	58	1	M	370000	2025-12-30 03:05:34.977883+00	\N
20	7	34	58	1	M	370000	2025-12-30 05:10:48.732663+00	\N
21	7	28	55	1	M	500000	2025-12-30 05:58:48.543581+00	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, title, slug, gender, image, parent_id, "order", created_at, updated_at, title_translations, show_on_homepage) FROM stdin;
19	2–7 лет	27-let	\N	\N	18	1	2025-12-20 17:38:35.016482+00	2025-12-20 17:42:34.567538+00	{"ru": "2\\u20137 \\u043b\\u0435\\u0442", "uz": "2\\u20137 yosh", "en": "2\\u20137 years", "es": "2\\u20137 a\\u00f1os"}	f
20	Платья	platya	\N	\N	19	1	2025-12-20 17:38:35.525199+00	2025-12-20 17:42:34.880813+00	{"ru": "\\u041f\\u043b\\u0430\\u0442\\u044c\\u044f", "uz": "Ko'ylaklar", "en": "Dresses", "es": "Vestidos"}	f
21	Топы и футболки	topy-i-futbolki	\N	\N	19	2	2025-12-20 17:38:36.032859+00	2025-12-20 17:42:35.189581+00	{"ru": "\\u0422\\u043e\\u043f\\u044b \\u0438 \\u0444\\u0443\\u0442\\u0431\\u043e\\u043b\\u043a\\u0438", "uz": "Toplar va futbolkalar", "en": "Tops and T-shirts", "es": "Tops y Camisetas"}	f
3	Мужчины	muzhchiny	male	https://libertywear.uz/api/uploads/images/d5f12584-fc09-4680-922a-04adc48809f6.png	\N	2	2025-12-15 00:31:25.010249+00	2025-12-29 05:39:28.029207+00	{"ru": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "uz": "Erkaklar", "en": "Men", "es": "Hombres"}	t
1	Женщины	zhenschiny	female	http://147.45.155.163:8000/uploads/images/a42899b1-62b7-41d1-80fa-4e8770490b9f.png	\N	1	2025-12-15 00:28:55.167969+00	2025-12-30 03:01:05.616027+00	{"ru": "\\u0416\\u0435\\u043d\\u0449\\u0438\\u043d\\u044b", "uz": "Ayollar", "en": "Women", "es": "Mujeres"}	t
13	Младенцы и новорождённые	mladentsy-i-novorozhdennye	\N	\N	12	1	2025-12-20 17:38:31.942513+00	2025-12-20 17:42:32.703775+00	{"ru": "\\u041c\\u043b\\u0430\\u0434\\u0435\\u043d\\u0446\\u044b \\u0438 \\u043d\\u043e\\u0432\\u043e\\u0440\\u043e\\u0436\\u0434\\u0451\\u043d\\u043d\\u044b\\u0435", "uz": "Chaqaloqlar va yangi tug'ilganlar", "en": "Babies and Newborns", "es": "Beb\\u00e9s y Reci\\u00e9n Nacidos"}	f
14	Комплекты	komplekty	\N	\N	13	1	2025-12-20 17:38:32.469662+00	2025-12-20 17:42:33.014656+00	{"ru": "\\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Komplektlar", "en": "Sets", "es": "Conjuntos"}	f
15	Боди	bodi	\N	\N	13	2	2025-12-20 17:38:32.982305+00	2025-12-20 17:42:33.324154+00	{"ru": "\\u0411\\u043e\\u0434\\u0438", "uz": "Bodilar", "en": "Bodysuits", "es": "Bodies"}	f
16	Брюки	bryuki	\N	\N	13	3	2025-12-20 17:38:33.491681+00	2025-12-20 17:42:33.633317+00	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
17	Домашняя одежда	domashnyaya-odezhda	\N	\N	13	4	2025-12-20 17:38:33.999428+00	2025-12-20 17:42:33.94194+00	{"ru": "\\u0414\\u043e\\u043c\\u0430\\u0448\\u043d\\u044f\\u044f \\u043e\\u0434\\u0435\\u0436\\u0434\\u0430", "uz": "Uy kiyimlari", "en": "Homewear", "es": "Ropa de Casa"}	f
18	Девочки	devochki	\N	\N	12	2	2025-12-20 17:38:34.507385+00	2025-12-20 17:42:34.25075+00	{"ru": "\\u0414\\u0435\\u0432\\u043e\\u0447\\u043a\\u0438", "uz": "Qizlar", "en": "Girls", "es": "Ni\\u00f1as"}	f
22	Свитшоты	svitshoty	\N	\N	19	3	2025-12-20 17:38:36.549467+00	2025-12-20 17:42:35.497967+00	{"ru": "\\u0421\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442\\u044b", "uz": "Svitshotlar", "en": "Sweatshirts", "es": "Sudaderas"}	f
23	Брюки	bryuki	\N	\N	19	4	2025-12-20 17:38:37.063281+00	2025-12-20 17:42:35.806905+00	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
24	Комплекты	komplekty	\N	\N	19	5	2025-12-20 17:38:37.570897+00	2025-12-20 17:42:36.115854+00	{"ru": "\\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Komplektlar", "en": "Sets", "es": "Conjuntos"}	f
25	Пижамы	pizhamy	\N	\N	19	6	2025-12-20 17:38:38.07818+00	2025-12-20 17:42:36.424256+00	{"ru": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u044b", "uz": "Pijamalar", "en": "Pajamas", "es": "Pijamas"}	f
26	Шорты	shorty	\N	\N	19	7	2025-12-20 17:38:38.586468+00	2025-12-20 17:42:36.733314+00	{"ru": "\\u0428\\u043e\\u0440\\u0442\\u044b", "uz": "Shortlar", "en": "Shorts", "es": "Shorts"}	f
27	Нижнее бельё	nizhnee-bele	\N	\N	19	8	2025-12-20 17:38:39.093959+00	2025-12-20 17:42:37.042634+00	{"ru": "\\u041d\\u0438\\u0436\\u043d\\u0435\\u0435 \\u0431\\u0435\\u043b\\u044c\\u0451", "uz": "Ichki kiyimlar", "en": "Underwear", "es": "Ropa Interior"}	f
28	8–14 лет	814-let	\N	\N	18	2	2025-12-20 17:38:39.60183+00	2025-12-20 17:42:37.352056+00	{"ru": "8\\u201314 \\u043b\\u0435\\u0442", "uz": "8\\u201314 yosh", "en": "8\\u201314 years", "es": "8\\u201314 a\\u00f1os"}	f
29	Платья	platya	\N	\N	28	1	2025-12-20 17:38:40.109284+00	2025-12-20 17:42:37.668314+00	{"ru": "\\u041f\\u043b\\u0430\\u0442\\u044c\\u044f", "uz": "Ko'ylaklar", "en": "Dresses", "es": "Vestidos"}	f
30	Топы и футболки	topy-i-futbolki	\N	\N	28	2	2025-12-20 17:38:40.617701+00	2025-12-20 17:42:37.98177+00	{"ru": "\\u0422\\u043e\\u043f\\u044b \\u0438 \\u0444\\u0443\\u0442\\u0431\\u043e\\u043b\\u043a\\u0438", "uz": "Toplar va futbolkalar", "en": "Tops and T-shirts", "es": "Tops y Camisetas"}	f
31	Свитшоты	svitshoty	\N	\N	28	3	2025-12-20 17:38:41.126729+00	2025-12-20 17:42:38.290205+00	{"ru": "\\u0421\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442\\u044b", "uz": "Svitshotlar", "en": "Sweatshirts", "es": "Sudaderas"}	f
32	Брюки	bryuki	\N	\N	28	4	2025-12-20 17:38:41.633928+00	2025-12-20 17:42:38.599688+00	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
33	Комплекты	komplekty	\N	\N	28	5	2025-12-20 17:38:42.141496+00	2025-12-20 17:42:38.910484+00	{"ru": "\\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Komplektlar", "en": "Sets", "es": "Conjuntos"}	f
34	Пижамы	pizhamy	\N	\N	28	6	2025-12-20 17:38:42.65043+00	2025-12-20 17:42:39.220789+00	{"ru": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u044b", "uz": "Pijamalar", "en": "Pajamas", "es": "Pijamas"}	f
37	Мальчики	malchiki	\N	\N	12	3	2025-12-20 17:38:44.180554+00	2025-12-20 17:42:40.156475+00	{"ru": "\\u041c\\u0430\\u043b\\u044c\\u0447\\u0438\\u043a\\u0438", "uz": "O'g'il bolalar", "en": "Boys", "es": "Ni\\u00f1os"}	f
40	Свитшоты	svitshoty	\N	\N	38	2	2025-12-20 17:38:45.726695+00	2025-12-20 17:42:41.094055+00	{"ru": "\\u0421\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442\\u044b", "uz": "Svitshotlar", "en": "Sweatshirts", "es": "Sudaderas"}	f
41	Брюки	bryuki	\N	\N	38	3	2025-12-20 17:38:46.23431+00	2025-12-20 17:42:41.402715+00	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
44	Шорты	shorty	\N	\N	38	6	2025-12-20 17:38:47.7608+00	2025-12-20 17:42:42.330115+00	{"ru": "\\u0428\\u043e\\u0440\\u0442\\u044b", "uz": "Shortlar", "en": "Shorts", "es": "Shorts"}	f
46	8–14 лет	814-let	\N	\N	37	2	2025-12-20 17:38:48.778919+00	2025-12-20 17:42:42.948763+00	{"ru": "8\\u201314 \\u043b\\u0435\\u0442", "uz": "8\\u201314 yosh", "en": "8\\u201314 years", "es": "8\\u201314 a\\u00f1os"}	f
49	Брюки	bryuki	\N	\N	46	3	2025-12-20 17:38:50.303769+00	2025-12-20 17:42:43.880175+00	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
51	Пижамы	pizhamy	\N	\N	46	5	2025-12-20 17:38:51.319646+00	2025-12-20 17:42:44.497448+00	{"ru": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u044b", "uz": "Pijamalar", "en": "Pajamas", "es": "Pijamas"}	f
35	Шорты	shorty	\N	\N	28	7	2025-12-20 17:38:43.158207+00	2025-12-20 17:42:39.529367+00	{"ru": "\\u0428\\u043e\\u0440\\u0442\\u044b", "uz": "Shortlar", "en": "Shorts", "es": "Shorts"}	f
36	Нижнее бельё	nizhnee-bele	\N	\N	28	8	2025-12-20 17:38:43.667277+00	2025-12-20 17:42:39.842205+00	{"ru": "\\u041d\\u0438\\u0436\\u043d\\u0435\\u0435 \\u0431\\u0435\\u043b\\u044c\\u0451", "uz": "Ichki kiyimlar", "en": "Underwear", "es": "Ropa Interior"}	f
38	2–7 лет	27-let	\N	\N	37	1	2025-12-20 17:38:44.695688+00	2025-12-20 17:42:40.474182+00	{"ru": "2\\u20137 \\u043b\\u0435\\u0442", "uz": "2\\u20137 yosh", "en": "2\\u20137 years", "es": "2\\u20137 a\\u00f1os"}	f
39	Топы и футболки	topy-i-futbolki	\N	\N	38	1	2025-12-20 17:38:45.212454+00	2025-12-20 17:42:40.785673+00	{"ru": "\\u0422\\u043e\\u043f\\u044b \\u0438 \\u0444\\u0443\\u0442\\u0431\\u043e\\u043b\\u043a\\u0438", "uz": "Toplar va futbolkalar", "en": "Tops and T-shirts", "es": "Tops y Camisetas"}	f
42	Комплекты	komplekty	\N	\N	38	4	2025-12-20 17:38:46.743069+00	2025-12-20 17:42:41.712537+00	{"ru": "\\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Komplektlar", "en": "Sets", "es": "Conjuntos"}	f
43	Пижамы	pizhamy	\N	\N	38	5	2025-12-20 17:38:47.252002+00	2025-12-20 17:42:42.021342+00	{"ru": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u044b", "uz": "Pijamalar", "en": "Pajamas", "es": "Pijamas"}	f
45	Нижнее бельё	nizhnee-bele	\N	\N	38	7	2025-12-20 17:38:48.269918+00	2025-12-20 17:42:42.639662+00	{"ru": "\\u041d\\u0438\\u0436\\u043d\\u0435\\u0435 \\u0431\\u0435\\u043b\\u044c\\u0451", "uz": "Ichki kiyimlar", "en": "Underwear", "es": "Ropa Interior"}	f
47	Топы и футболки	topy-i-futbolki	\N	\N	46	1	2025-12-20 17:38:49.288358+00	2025-12-20 17:42:43.262509+00	{"ru": "\\u0422\\u043e\\u043f\\u044b \\u0438 \\u0444\\u0443\\u0442\\u0431\\u043e\\u043b\\u043a\\u0438", "uz": "Toplar va futbolkalar", "en": "Tops and T-shirts", "es": "Tops y Camisetas"}	f
48	Свитшоты	svitshoty	\N	\N	46	2	2025-12-20 17:38:49.796119+00	2025-12-20 17:42:43.571692+00	{"ru": "\\u0421\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442\\u044b", "uz": "Svitshotlar", "en": "Sweatshirts", "es": "Sudaderas"}	f
50	Комплекты	komplekty	\N	\N	46	4	2025-12-20 17:38:50.812547+00	2025-12-20 17:42:44.188613+00	{"ru": "\\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Komplektlar", "en": "Sets", "es": "Conjuntos"}	f
52	Шорты	shorty	\N	\N	46	6	2025-12-20 17:38:51.82829+00	2025-12-20 17:42:44.80645+00	{"ru": "\\u0428\\u043e\\u0440\\u0442\\u044b", "uz": "Shortlar", "en": "Shorts", "es": "Shorts"}	f
53	Нижнее бельё	nizhnee-bele	\N	\N	46	7	2025-12-20 17:38:52.336214+00	2025-12-20 17:42:45.115984+00	{"ru": "\\u041d\\u0438\\u0436\\u043d\\u0435\\u0435 \\u0431\\u0435\\u043b\\u044c\\u0451", "uz": "Ichki kiyimlar", "en": "Underwear", "es": "Ropa Interior"}	f
55	Футболки	futbolki	female	\N	1	1	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0424\\u0443\\u0442\\u0431\\u043e\\u043b\\u043a\\u0438", "uz": "Futbolkalar", "en": "T-shirts", "es": "Camisetas"}	f
56	Толстовки и свитшоты	tolstovki-i-svitshoty	female	\N	1	2	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0422\\u043e\\u043b\\u0441\\u0442\\u043e\\u0432\\u043a\\u0438 \\u0438 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442\\u044b", "uz": "Svitshotlar va koftalar", "en": "Hoodies and Sweatshirts", "es": "Sudaderas y Buzos"}	f
57	Комплекты	komplekty	female	\N	1	3	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Komplektlar", "en": "Sets", "es": "Conjuntos"}	f
58	Спортивные комплекты	sportivnye-komplekty	female	\N	1	4	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0421\\u043f\\u043e\\u0440\\u0442\\u0438\\u0432\\u043d\\u044b\\u0435 \\u043a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442\\u044b", "uz": "Sport komplektlari", "en": "Sport Sets", "es": "Conjuntos Deportivos"}	f
59	Юбки	yubki	female	\N	1	5	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u042e\\u0431\\u043a\\u0438", "uz": "Yubkalar", "en": "Skirts", "es": "Faldas"}	f
60	Брюки	bryuki	female	\N	1	6	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
61	Шорты	shorty	female	\N	1	7	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0428\\u043e\\u0440\\u0442\\u044b", "uz": "Shortlar", "en": "Shorts", "es": "Shorts"}	f
62	Домашняя одежда	domashnyaya-odezhda	female	\N	1	8	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0414\\u043e\\u043c\\u0430\\u0448\\u043d\\u044f\\u044f \\u043e\\u0434\\u0435\\u0436\\u0434\\u0430", "uz": "Uy kiyimlari", "en": "Homewear", "es": "Ropa de Casa"}	f
63	Пижамы	pizhamy	female	\N	1	9	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u044b", "uz": "Pijamalar", "en": "Pajamas", "es": "Pijamas"}	f
64	Нижнее бельё	nizhnee-bele	female	\N	1	10	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u041d\\u0438\\u0436\\u043d\\u0435\\u0435 \\u0431\\u0435\\u043b\\u044c\\u0451", "uz": "Ichki kiyimlar", "en": "Underwear", "es": "Ropa Interior"}	f
65	Футболки	futbolki	male	\N	3	1	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0424\\u0443\\u0442\\u0431\\u043e\\u043b\\u043a\\u0438", "uz": "Futbolkalar", "en": "T-shirts", "es": "Camisetas"}	f
66	Толстовки и свитшоты	tolstovki-i-svitshoty	male	\N	3	2	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0422\\u043e\\u043b\\u0441\\u0442\\u043e\\u0432\\u043a\\u0438 \\u0438 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442\\u044b", "uz": "Svitshotlar va koftalar", "en": "Hoodies and Sweatshirts", "es": "Sudaderas y Buzos"}	f
67	Брюки	bryuki	male	\N	3	3	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0411\\u0440\\u044e\\u043a\\u0438", "uz": "Shimlar", "en": "Pants", "es": "Pantalones"}	f
68	Шорты	shorty	male	\N	3	4	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0428\\u043e\\u0440\\u0442\\u044b", "uz": "Shortlar", "en": "Shorts", "es": "Shorts"}	f
69	Домашняя одежда	domashnyaya-odezhda	male	\N	3	5	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u0414\\u043e\\u043c\\u0430\\u0448\\u043d\\u044f\\u044f \\u043e\\u0434\\u0435\\u0436\\u0434\\u0430", "uz": "Uy kiyimlari", "en": "Homewear", "es": "Ropa de Casa"}	f
70	Пижамы	pizhamy	male	\N	3	6	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u044b", "uz": "Pijamalar", "en": "Pajamas", "es": "Pijamas"}	f
71	Нижнее бельё	nizhnee-bele	male	\N	3	7	2025-12-21 00:46:12.390957+00	\N	{"ru": "\\u041d\\u0438\\u0436\\u043d\\u0435\\u0435 \\u0431\\u0435\\u043b\\u044c\\u0451", "uz": "Ichki kiyimlar", "en": "Underwear", "es": "Ropa Interior"}	f
12	Дети	deti	kids	http://147.45.155.163:8000/uploads/images/38f3264f-3e09-45b6-bf5c-25564039cbdb.png	\N	3	2025-12-20 17:38:31.404485+00	2025-12-30 02:59:41.270179+00	{"ru": "\\u0414\\u0435\\u0442\\u0438", "uz": "Bolalar", "en": "Children", "es": "Ni\\u00f1os"}	t
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, name, email, message, admin_reply, is_read, created_at, updated_at) FROM stdin;
2	notferuz	notferuz@gmail.com	test	\N	t	2025-12-18 11:28:15.472987+00	2025-12-18 11:58:51.109007+00
1	феруз	notferuz@gmail.cpm	test	\N	t	2025-12-18 11:25:36.081533+00	2025-12-18 11:59:02.851236+00
3	notferuz	notferuz@gmail.com	test	test	t	2025-12-21 12:13:49.711668+00	2025-12-21 12:14:04.384671+00
4	notferuz	notferuz@gmail.com	test	\N	t	2025-12-25 09:28:51.383985+00	2025-12-25 09:28:59.413757+00
5	notferuz	notferuz@gmail.com	тест	\N	t	2025-12-27 15:40:32.521928+00	2025-12-27 15:40:55.772532+00
6	feruza	f.atabaeva1984@gmail.com	test test	\N	f	2025-12-30 03:59:45.511099+00	\N
\.


--
-- Data for Name: contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_info (id, icon_type, title, content, details, "order", created_at, updated_at, title_translations, content_translations) FROM stdin;
2	map	Учтепа тумани (ориентир Макронка )	Вы можете отправить нам письмо по любым вопросам: от информации о товарах до сотрудничества с брендом Liberty. Мы всегда рады помочь!	Email: info@liberty.uz  Время ответа: Обычно отвечаем в течение 24 часов  Дополнительно: Письма принимаются круглосуточно, включая выходные	2	2025-12-15 01:30:28.274478+00	2025-12-30 04:49:45.478389+00	{"ru": "\\u0423\\u0447\\u0442\\u0435\\u043f\\u0430 \\u0442\\u0443\\u043c\\u0430\\u043d\\u0438 (\\u043e\\u0440\\u0438\\u0435\\u043d\\u0442\\u0438\\u0440 \\u041c\\u0430\\u043a\\u0440\\u043e\\u043d\\u043a\\u0430 )", "uz": "Uchtepa tumani (mo\\u2018ljal: Makronka)", "en": "Uchtepa district (landmark: Makronka)", "es": "Distrito de Uchtepa (punto de referencia: Makronka)"}	{"ru": "\\u0412\\u044b \\u043c\\u043e\\u0436\\u0435\\u0442\\u0435 \\u043e\\u0442\\u043f\\u0440\\u0430\\u0432\\u0438\\u0442\\u044c \\u043d\\u0430\\u043c \\u043f\\u0438\\u0441\\u044c\\u043c\\u043e \\u043f\\u043e \\u043b\\u044e\\u0431\\u044b\\u043c \\u0432\\u043e\\u043f\\u0440\\u043e\\u0441\\u0430\\u043c: \\u043e\\u0442 \\u0438\\u043d\\u0444\\u043e\\u0440\\u043c\\u0430\\u0446\\u0438\\u0438 \\u043e \\u0442\\u043e\\u0432\\u0430\\u0440\\u0430\\u0445 \\u0434\\u043e \\u0441\\u043e\\u0442\\u0440\\u0443\\u0434\\u043d\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u0430 \\u0441 \\u0431\\u0440\\u0435\\u043d\\u0434\\u043e\\u043c Liberty. \\u041c\\u044b \\u0432\\u0441\\u0435\\u0433\\u0434\\u0430 \\u0440\\u0430\\u0434\\u044b \\u043f\\u043e\\u043c\\u043e\\u0447\\u044c!", "uz": "Siz bizga har qanday savollar bo\\u2018yicha xat yuborishingiz mumkin: mahsulotlar haqidagi ma\\u2019lumotlardan tortib Liberty brendi bilan hamkorlik masalalarigacha. Biz har doim yordam berishdan mamnunmiz!", "en": "You can send us a message with any questions, from product information to cooperation with the Liberty brand. We are always happy to help!", "es": "Puede enviarnos un mensaje con cualquier consulta: desde informaci\\u00f3n sobre los productos hasta la cooperaci\\u00f3n con la marca Liberty. \\u00a1Siempre estaremos encantados de ayudarle!"}
3	clock	Часы работы	Мы рады видеть вас в нашем магазине и всегда готовы помочь с выбором одежды и аксессуаров.	Понедельник – Пятница: 10:00 – 19:00  Суббота: 11:00 – 17:00  Воскресенье: выходной  Примечание: Возможны индивидуальные встречи по предварительной записи.	3	2025-12-15 01:30:53.900505+00	2025-12-30 04:51:06.867993+00	{"ru": "\\u0427\\u0430\\u0441\\u044b \\u0440\\u0430\\u0431\\u043e\\u0442\\u044b", "uz": "Ish vaqti", "en": "Working hours", "es": "Horario de trabajo"}	{"ru": "\\u041c\\u044b \\u0440\\u0430\\u0434\\u044b \\u0432\\u0438\\u0434\\u0435\\u0442\\u044c \\u0432\\u0430\\u0441 \\u0432 \\u043d\\u0430\\u0448\\u0435\\u043c \\u043c\\u0430\\u0433\\u0430\\u0437\\u0438\\u043d\\u0435 \\u0438 \\u0432\\u0441\\u0435\\u0433\\u0434\\u0430 \\u0433\\u043e\\u0442\\u043e\\u0432\\u044b \\u043f\\u043e\\u043c\\u043e\\u0447\\u044c \\u0441 \\u0432\\u044b\\u0431\\u043e\\u0440\\u043e\\u043c \\u043e\\u0434\\u0435\\u0436\\u0434\\u044b \\u0438 \\u0430\\u043a\\u0441\\u0435\\u0441\\u0441\\u0443\\u0430\\u0440\\u043e\\u0432.", "uz": "Sizni do\\u2018konimizda ko\\u2018rishdan mamnunmiz va kiyim hamda aksessuarlarni tanlashda har doim yordam berishga tayyormiz.", "en": "We are happy to see you in our store and are always ready to help you choose clothing and accessories.", "es": "Nos alegra verle en nuestra tienda y siempre estamos listos para ayudarle a elegir ropa y accesorios."}
1	phone	Свяжитесь с нами	Наши консультанты всегда готовы помочь вам с выбором одежды, оформлением заказа или ответить на любые вопросы о бренде Liberty.	Телефон: 998 97 1449420 Рабочие часы звонков: Пн–Пт: 09:00–18:00  	1	2025-12-15 01:29:29.700924+00	2025-12-30 04:48:15.139901+00	{"ru": "\\u0421\\u0432\\u044f\\u0436\\u0438\\u0442\\u0435\\u0441\\u044c \\u0441 \\u043d\\u0430\\u043c\\u0438", "uz": "Biz bilan bog'lanish", "en": "Contact us", "es": "Cont\\u00e1ctenos"}	{"ru": "\\u041d\\u0430\\u0448\\u0438 \\u043a\\u043e\\u043d\\u0441\\u0443\\u043b\\u044c\\u0442\\u0430\\u043d\\u0442\\u044b \\u0432\\u0441\\u0435\\u0433\\u0434\\u0430 \\u0433\\u043e\\u0442\\u043e\\u0432\\u044b \\u043f\\u043e\\u043c\\u043e\\u0447\\u044c \\u0432\\u0430\\u043c \\u0441 \\u0432\\u044b\\u0431\\u043e\\u0440\\u043e\\u043c \\u043e\\u0434\\u0435\\u0436\\u0434\\u044b, \\u043e\\u0444\\u043e\\u0440\\u043c\\u043b\\u0435\\u043d\\u0438\\u0435\\u043c \\u0437\\u0430\\u043a\\u0430\\u0437\\u0430 \\u0438\\u043b\\u0438 \\u043e\\u0442\\u0432\\u0435\\u0442\\u0438\\u0442\\u044c \\u043d\\u0430 \\u043b\\u044e\\u0431\\u044b\\u0435 \\u0432\\u043e\\u043f\\u0440\\u043e\\u0441\\u044b \\u043e \\u0431\\u0440\\u0435\\u043d\\u0434\\u0435 Liberty.", "uz": "Bizning maslahatchilarimiz kiyim tanlashda, buyurtmani rasmiylashtirishda yordam berishga yoki Liberty brendi haqidagi har qanday savollaringizga javob berishga doimo tayyor.", "en": "Our consultants are always ready to help you choose clothing, place an order, or answer any questions about the Liberty brand.", "es": "Nuestros asesores siempre est\\u00e1n listos para ayudarle a elegir ropa, realizar un pedido o responder a cualquier pregunta sobre la marca Liberty."}
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, phone, subject, message, is_read, created_at) FROM stdin;
1	Феруз	notferuz@gmail.com	935653801	тест	тест	t	2025-12-15 01:32:42.423167+00
2	feruz	notferuz@gmail.com	+998935653801	тест	test	t	2025-12-21 12:14:28.751209+00
\.


--
-- Data for Name: faq_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faq_items (id, question, answer, "order", created_at, updated_at, question_translations, answer_translations) FROM stdin;
2	Можно ли вернуть или обменять товар?	Да, вы можете вернуть товар в течение 30 дней с момента получения. Обмен возможен в течение 14 дней. Товар должен быть в оригинальной упаковке и без следов носки.	2	2025-12-15 01:31:48.458673+00	\N	\N	\N
3	Сколько времени занимает доставка?	Стандартная доставка по Ташкенту занимает 1–3 рабочих дня. Доставка по Узбекистану обычно занимает 3–7 рабочих дней. Бесплатная доставка доступна при заказе от 500,000 UZS.	3	2025-12-15 01:31:59.801301+00	\N	\N	\N
4	Как я могу связаться с поддержкой?	Вы можете связаться с нами по телефону +998 90 123 45 67, через Email info@liberty.uz\n или в мессенджерах Telegram / WhatsApp. Мы отвечаем в течение 24 часов.	4	2025-12-15 01:32:13.529757+00	\N	\N	\N
1	Как выбрать правильный размер одежды?	Мы предоставляем подробный гид по размерам для каждого товара. Пожалуйста, ознакомьтесь с таблицей размеров на странице продукта, чтобы выбрать подходящий вариант.	1	2025-12-15 01:31:37.556961+00	2025-12-27 13:37:32.632925+00	{"ru": "\\u041a\\u0430\\u043a \\u0432\\u044b\\u0431\\u0440\\u0430\\u0442\\u044c \\u043f\\u0440\\u0430\\u0432\\u0438\\u043b\\u044c\\u043d\\u044b\\u0439 \\u0440\\u0430\\u0437\\u043c\\u0435\\u0440 \\u043e\\u0434\\u0435\\u0436\\u0434\\u044b?", "uz": "To'g'ri kiyim o'lchamini qanday tanlash mumkin?", "en": "", "es": ""}	{"ru": "\\u041c\\u044b \\u043f\\u0440\\u0435\\u0434\\u043e\\u0441\\u0442\\u0430\\u0432\\u043b\\u044f\\u0435\\u043c \\u043f\\u043e\\u0434\\u0440\\u043e\\u0431\\u043d\\u044b\\u0439 \\u0433\\u0438\\u0434 \\u043f\\u043e \\u0440\\u0430\\u0437\\u043c\\u0435\\u0440\\u0430\\u043c \\u0434\\u043b\\u044f \\u043a\\u0430\\u0436\\u0434\\u043e\\u0433\\u043e \\u0442\\u043e\\u0432\\u0430\\u0440\\u0430. \\u041f\\u043e\\u0436\\u0430\\u043b\\u0443\\u0439\\u0441\\u0442\\u0430, \\u043e\\u0437\\u043d\\u0430\\u043a\\u043e\\u043c\\u044c\\u0442\\u0435\\u0441\\u044c \\u0441 \\u0442\\u0430\\u0431\\u043b\\u0438\\u0446\\u0435\\u0439 \\u0440\\u0430\\u0437\\u043c\\u0435\\u0440\\u043e\\u0432 \\u043d\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043d\\u0438\\u0446\\u0435 \\u043f\\u0440\\u043e\\u0434\\u0443\\u043a\\u0442\\u0430, \\u0447\\u0442\\u043e\\u0431\\u044b \\u0432\\u044b\\u0431\\u0440\\u0430\\u0442\\u044c \\u043f\\u043e\\u0434\\u0445\\u043e\\u0434\\u044f\\u0449\\u0438\\u0439 \\u0432\\u0430\\u0440\\u0438\\u0430\\u043d\\u0442.", "uz": "", "en": "", "es": ""}
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, product_id, created_at) FROM stdin;
1	1	13	2025-12-21 10:32:08.173269+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, variant_id, quantity, size, price, total_price, product_data, created_at) FROM stdin;
1	1	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-15 01:22:28.500317+00
2	2	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-15 06:42:28.848705+00
3	3	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 10:12:17.09433+00
4	3	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 10:12:17.09433+00
5	4	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 12:51:46.207085+00
6	4	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 12:51:46.207085+00
7	5	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:13:56.453175+00
8	5	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:13:56.453175+00
9	6	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:18:38.134711+00
10	6	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:18:38.134711+00
11	7	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:18:41.150382+00
12	7	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:18:41.150382+00
13	8	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:20:49.75098+00
14	8	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:20:49.75098+00
15	9	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:35:43.600173+00
16	9	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:35:43.600173+00
17	10	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:35:46.199611+00
18	10	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:35:46.199611+00
19	11	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:36:00.548863+00
20	11	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:36:00.548863+00
21	12	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 13:56:06.416475+00
22	12	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 13:56:06.416475+00
23	13	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 14:47:43.620927+00
24	13	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 14:47:43.620927+00
25	14	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 14:47:46.061062+00
26	14	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 14:47:46.061062+00
27	15	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 14:47:52.478373+00
28	15	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 14:47:52.478373+00
29	16	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 14:47:55.086181+00
30	16	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 14:47:55.086181+00
31	17	1	6	1	\N	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp"}	2025-12-19 14:53:36.36414+00
32	17	5	1	1	\N	298	298	{"product_name": "\\u0442\\u0435\\u0441\\u0442 1", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-19 14:53:36.36414+00
33	23	13	29	1	S	400000	400000	{"product_name": "\\u041a\\u043e\\u0441\\u0442\\u044e\\u043c \\u0441\\u043f\\u043e\\u0440\\u0442\\u0438\\u0432\\u043d\\u044b\\u0439", "variant_name": "\\u0447\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/d5225d35-ea66-44ba-b31b-92fb17e5a5f8.png"}	2025-12-21 09:45:48.815621+00
34	23	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-21 09:45:48.815621+00
35	24	13	29	1	S	400000	400000	{"product_name": "\\u041a\\u043e\\u0441\\u0442\\u044e\\u043c \\u0441\\u043f\\u043e\\u0440\\u0442\\u0438\\u0432\\u043d\\u044b\\u0439", "variant_name": "\\u0447\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/d5225d35-ea66-44ba-b31b-92fb17e5a5f8.png"}	2025-12-21 09:55:27.69122+00
36	24	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-21 09:55:27.69122+00
37	25	13	29	1	S	400000	400000	{"product_name": "\\u041a\\u043e\\u0441\\u0442\\u044e\\u043c \\u0441\\u043f\\u043e\\u0440\\u0442\\u0438\\u0432\\u043d\\u044b\\u0439", "variant_name": "\\u0447\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/d5225d35-ea66-44ba-b31b-92fb17e5a5f8.png"}	2025-12-21 09:56:05.617536+00
38	25	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-21 09:56:05.617536+00
39	26	13	29	1	S	400000	400000	{"product_name": "\\u041a\\u043e\\u0441\\u0442\\u044e\\u043c \\u0441\\u043f\\u043e\\u0440\\u0442\\u0438\\u0432\\u043d\\u044b\\u0439", "variant_name": "\\u0447\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/d5225d35-ea66-44ba-b31b-92fb17e5a5f8.png"}	2025-12-21 12:07:18.928614+00
40	26	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-21 12:07:18.928614+00
41	27	13	29	1	S	400000	400000	{"product_name": "\\u041a\\u043e\\u0441\\u0442\\u044e\\u043c \\u0441\\u043f\\u043e\\u0440\\u0442\\u0438\\u0432\\u043d\\u044b\\u0439", "variant_name": "\\u0447\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/d5225d35-ea66-44ba-b31b-92fb17e5a5f8.png"}	2025-12-21 12:07:57.973405+00
42	27	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-21 12:07:57.973405+00
43	28	8	27	1	M	350000	350000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u041c\\u0410\\u041b\\u042c\\u0427\\u0418\\u041a\\u041e\\u0412", "variant_name": "Seriy", "image_url": "https://libertywear.uz/uploads/images/3af292cd-0429-4dd3-ada0-35dc02948d4f.png"}	2025-12-21 12:09:05.194734+00
44	29	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-22 08:47:56.856993+00
45	30	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-22 08:48:00.243368+00
46	32	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 12:13:06.322715+00
47	32	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 12:13:06.322715+00
48	33	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 12:13:10.587296+00
49	33	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 12:13:10.587296+00
50	34	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 12:13:16.941882+00
51	34	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 12:13:16.941882+00
52	35	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 12:18:17.830924+00
53	35	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 12:18:17.830924+00
54	35	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 12:18:17.830924+00
55	36	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 12:18:26.827252+00
56	36	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 12:18:26.827252+00
57	36	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 12:18:26.827252+00
58	37	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 12:18:37.710369+00
59	37	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 12:18:37.710369+00
60	37	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 12:18:37.710369+00
61	38	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 13:05:50.58728+00
62	38	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 13:05:50.58728+00
63	38	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 13:05:50.58728+00
64	38	34	58	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/0432d2d9-5643-4067-afa4-0c4ee3abb0b1.jpg"}	2025-12-26 13:05:50.58728+00
65	39	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 13:05:53.104877+00
66	39	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 13:05:53.104877+00
67	39	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 13:05:53.104877+00
68	39	34	58	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/0432d2d9-5643-4067-afa4-0c4ee3abb0b1.jpg"}	2025-12-26 13:05:53.104877+00
69	40	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 13:10:02.865511+00
70	40	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 13:10:02.865511+00
71	40	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 13:10:02.865511+00
72	40	34	58	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/0432d2d9-5643-4067-afa4-0c4ee3abb0b1.jpg"}	2025-12-26 13:10:02.865511+00
73	41	1	1	1	M	298	298	{"product_name": "Aurora GORE-TEX\\u00ae Shell", "variant_name": "Midnight Black", "image_url": "http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp"}	2025-12-26 13:13:02.072811+00
74	41	29	62	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0441\\u043a\\u043e\\u0439 \\u041a\\u043e\\u043c\\u043f\\u043b\\u0435\\u043a\\u0442", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u044b\\u0439", "image_url": "https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png"}	2025-12-26 13:13:02.072811+00
75	41	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-26 13:13:02.072811+00
76	41	34	58	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/0432d2d9-5643-4067-afa4-0c4ee3abb0b1.jpg"}	2025-12-26 13:13:02.072811+00
77	42	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:13:23.402345+00
78	43	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:15:13.584778+00
79	44	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:15:25.378614+00
80	45	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:15:30.113832+00
81	46	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:17:46.986932+00
82	47	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:17:52.268775+00
83	48	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:23:55.431113+00
84	49	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:24:16.311701+00
85	50	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:28:09.322068+00
86	51	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:29:51.751847+00
87	52	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:36:13.157126+00
88	53	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:36:19.265098+00
89	54	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:36:28.661744+00
90	55	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:36:43.381645+00
91	56	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:36:49.983362+00
92	57	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:39:47.50843+00
93	58	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:39:55.197561+00
94	59	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:42:56.539426+00
95	60	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 13:44:56.626934+00
96	61	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 14:40:48.385268+00
97	62	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 14:42:44.774294+00
98	63	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 15:32:37.705643+00
99	64	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-26 15:32:45.125822+00
101	66	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 10:54:22.332739+00
102	67	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 11:02:24.225858+00
103	68	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 11:03:11.396971+00
104	69	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 11:18:44.884278+00
105	70	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 11:59:52.150819+00
106	71	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 12:04:38.830247+00
107	72	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 12:04:59.054947+00
108	73	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 12:07:13.795545+00
109	74	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 12:25:21.249342+00
110	75	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 12:29:44.662254+00
111	76	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-27 15:39:43.175502+00
112	77	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-28 14:39:57.752196+00
113	78	42	78	1	M	500000	500000	{"product_name": "\\u041c\\u0443\\u0436\\u0447\\u0438\\u043d\\u044b", "variant_name": "\\u0427\\u0435\\u0440\\u043d\\u0438\\u0439", "image_url": "https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png"}	2025-12-28 14:40:34.497202+00
114	79	12	\N	1	M	300000	300000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u0414\\u0415\\u0412\\u041e\\u0427\\u0415\\u041a.", "variant_name": null, "image_url": "https://libertywear.uz/uploads/images/a841d2a9-0ae7-4dc1-9cf2-7de4051db729.png"}	2025-12-29 18:56:46.838199+00
115	79	10	\N	1	M	370000	370000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u0414\\u0415\\u0412\\u041e\\u0427\\u0415\\u041a.", "variant_name": null, "image_url": "https://libertywear.uz/uploads/images/bbdbacf2-f4cd-4704-8193-6f88a200beb9.png"}	2025-12-29 18:56:46.838199+00
116	79	37	73	1	M	150000	150000	{"product_name": "\\u041f\\u0438\\u0436\\u0430\\u043c\\u0430 \\u0434\\u043b\\u044f \\u0434\\u0435\\u0432\\u043e\\u0447\\u0435\\u043a, \\u0441 \\u043f\\u0440\\u0438\\u043d\\u0442\\u043e\\u043c", "variant_name": "\\u0413\\u043e\\u043b\\u0443\\u0431\\u043e\\u0439", "image_url": "https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png"}	2025-12-29 18:56:46.838199+00
117	80	12	\N	1	M	300000	300000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u0414\\u0415\\u0412\\u041e\\u0427\\u0415\\u041a.", "variant_name": null, "image_url": "https://libertywear.uz/uploads/images/a841d2a9-0ae7-4dc1-9cf2-7de4051db729.png"}	2025-12-29 19:13:32.342015+00
118	80	10	\N	1	M	370000	370000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u0414\\u0415\\u0412\\u041e\\u0427\\u0415\\u041a.", "variant_name": null, "image_url": "https://libertywear.uz/uploads/images/bbdbacf2-f4cd-4704-8193-6f88a200beb9.png"}	2025-12-29 19:13:32.342015+00
119	80	35	54	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "http://147.45.155.163:8000/uploads/images/ea296948-6505-4e3a-9ae2-6f2013a08d10.jpg"}	2025-12-29 19:13:32.342015+00
120	81	12	\N	1	M	300000	300000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u0414\\u0415\\u0412\\u041e\\u0427\\u0415\\u041a.", "variant_name": null, "image_url": "https://libertywear.uz/uploads/images/a841d2a9-0ae7-4dc1-9cf2-7de4051db729.png"}	2025-12-30 03:05:48.957519+00
121	81	10	\N	1	M	370000	370000	{"product_name": "\\u041f\\u0418\\u0416\\u0410\\u041c\\u0410 \\u0414\\u041b\\u042f \\u0414\\u0415\\u0412\\u041e\\u0427\\u0415\\u041a.", "variant_name": null, "image_url": "https://libertywear.uz/uploads/images/bbdbacf2-f4cd-4704-8193-6f88a200beb9.png"}	2025-12-30 03:05:48.957519+00
122	81	35	54	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "http://147.45.155.163:8000/uploads/images/ea296948-6505-4e3a-9ae2-6f2013a08d10.jpg"}	2025-12-30 03:05:48.957519+00
123	81	34	58	1	M	370000	370000	{"product_name": "\\u0416\\u0435\\u043d\\u0441\\u043a\\u0438\\u0439 \\u0441\\u0432\\u0438\\u0442\\u0448\\u043e\\u0442 ", "variant_name": "\\u0421\\u0435\\u0440\\u0438\\u0439", "image_url": "https://libertywear.uz/uploads/images/0432d2d9-5643-4067-afa4-0c4ee3abb0b1.jpg"}	2025-12-30 03:05:48.957519+00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, discount_amount, payment_method, payment_status, order_status, address, notes, created_at, updated_at) FROM stdin;
1	1	298	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-15 01:22:28.500317+00	\N
2	1	298	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-15 06:42:28.848705+00	\N
3	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 10:12:17.09433+00	\N
4	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 12:51:46.207085+00	\N
5	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:13:56.453175+00	\N
6	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:18:38.134711+00	\N
7	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:18:41.150382+00	\N
8	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:20:49.75098+00	\N
9	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:35:43.600173+00	\N
10	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:35:46.199611+00	\N
11	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:36:00.548863+00	\N
12	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 13:56:06.416475+00	\N
13	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 14:47:43.620927+00	\N
14	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 14:47:46.061062+00	\N
15	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 14:47:52.478373+00	\N
16	1	596	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 14:47:55.086181+00	\N
17	1	596	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-19 14:53:36.36414+00	\N
18	1	400000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 00:53:06.987213+00	\N
19	1	400000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 00:53:46.759234+00	\N
20	1	400000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 00:59:10.468922+00	\N
21	1	400000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 09:40:31.69174+00	\N
22	1	400000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 09:41:17.246943+00	\N
23	1	400298	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 09:45:48.815621+00	\N
24	1	400298	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 09:55:27.69122+00	\N
25	1	400298	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 09:56:05.617536+00	\N
26	1	400298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 12:07:18.928614+00	\N
27	1	400298	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 12:07:57.973405+00	\N
28	1	350000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-21 12:09:05.194734+00	\N
29	1	298	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-22 08:47:56.856993+00	\N
30	1	298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-22 08:48:00.243368+00	\N
31	5	50000	0	payme	pending	pending	Test Address 123, Tashkent	Test order for Payme testing	2025-12-22 12:49:41.165478+00	\N
32	1	500298	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 12:13:06.322715+00	\N
33	1	500298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 12:13:10.587296+00	\N
34	1	500298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 12:13:16.941882+00	\N
35	1	650298	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 12:18:17.830924+00	\N
36	1	650298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 12:18:26.827252+00	\N
37	1	650298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 12:18:37.710369+00	\N
38	1	1020298	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:05:50.58728+00	\N
39	1	1020298	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:05:53.104877+00	\N
40	1	1020298	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:10:02.865511+00	\N
41	1	1020298	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:13:02.072811+00	\N
42	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:13:23.402345+00	\N
43	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:15:13.584778+00	\N
44	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:15:25.378614+00	\N
45	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:15:30.113832+00	\N
46	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:17:46.986932+00	\N
47	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:17:52.268775+00	\N
48	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:23:55.431113+00	\N
49	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:24:16.311701+00	\N
50	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:28:09.322068+00	\N
51	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:29:51.751847+00	\N
52	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:36:13.157126+00	\N
53	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:36:19.265098+00	\N
54	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:36:28.661744+00	\N
55	1	500000	0	cash	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:36:43.381645+00	\N
56	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:36:49.983362+00	\N
57	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:39:47.50843+00	\N
58	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:39:55.197561+00	\N
59	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:42:56.539426+00	\N
60	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 13:44:56.626934+00	\N
61	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 14:40:48.385268+00	\N
62	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 14:42:44.774294+00	\N
63	1	500000	0	yustex	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 15:32:37.705643+00	\N
64	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-26 15:32:45.125822+00	\N
66	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 10:54:22.332739+00	\N
67	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 11:02:24.225858+00	\N
68	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 11:03:11.396971+00	\N
69	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 11:18:44.884278+00	\N
70	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 11:59:52.150819+00	\N
71	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 12:04:38.830247+00	\N
72	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 12:04:59.054947+00	\N
73	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 12:07:13.795545+00	\N
74	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 12:25:21.249342+00	\N
75	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 12:29:44.662254+00	\N
76	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-27 15:39:43.175502+00	\N
77	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-28 14:39:57.752196+00	\N
78	1	500000	0	payme	pending	pending	Феруз, Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира,Ташкент, 100001, +998935653801,tashkent_city		2025-12-28 14:40:34.497202+00	\N
79	3	820000	0	payme	pending	pending	feruza, Arnasaoy7a,Toshkent, 0001000, +998883187778,tashkent_city		2025-12-29 18:56:46.838199+00	\N
80	3	1040000	0	cash	pending	pending	feruza, Arnasaoy7a,Toshkent, 0001000, +998883187778,tashkent_city		2025-12-29 19:13:32.342015+00	\N
81	3	1410000	0	payme	pending	pending	feruza, Arnasaoy7a,Toshkent, 0001000, +998883187778,tashkent_city		2025-12-30 03:05:48.957519+00	\N
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partners (id, name, logo_url, website_url, "order", is_active, created_at, updated_at) FROM stdin;
4	Uzum Market	http://147.45.155.163:8000/uploads/images/bb0de16a-5d5c-44c1-881d-4b9c981c9657.png	https://uzum.uz/uz	0	t	2025-12-23 09:17:42.126973+00	\N
5	Trendyol	http://147.45.155.163:8000/uploads/images/c6e33e9b-8120-4af4-a4e1-6d9135403c24.png	https://www.trendyol.com/	3	t	2025-12-23 09:29:12.285534+00	\N
6	aliexpress	http://147.45.155.163:8000/uploads/images/44ddf27c-3fc3-49a8-be46-12fa8dd84eb7.png	https://aliexpress.ru/	4	t	2025-12-23 09:30:12.422267+00	\N
\.


--
-- Data for Name: payme_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payme_transactions (id, payme_transaction_id, merchant_transaction_id, user_id, order_id, amount, state, reason, create_time, perform_time, cancel_time, account, created_at, updated_at) FROM stdin;
1	6945568220cfb2025b9f9ced	ORDER_1_1766151810961	1	1	50000	1	\N	1766151810742	\N	\N	{"user_id": "1", "order_id": "1"}	2025-12-19 13:43:30.957084+00	\N
2	6945568320cfb2025b9f9cee	ORDER_1_1766151811864	1	1	50000	1	\N	1766151811648	\N	\N	{"user_id": "1", "order_id": "1"}	2025-12-19 13:43:31.862986+00	\N
3	6945577020cfb2025b9f9cf1	ORDER_2_1766152048642	1	2	50000	-2	5	1766152048412	1766152124492	1766152298538	{"user_id": "1", "order_id": "2"}	2025-12-19 13:47:28.636752+00	2025-12-19 13:51:38.536405+00
4	6949061420cfb2025b9fa01b	ORDER_2_1766393365391	1	2	10000	2	\N	1766393364875	\N	\N	{"user_id": "1", "order_id": "2"}	2025-12-22 08:49:25.360961+00	2025-12-22 11:39:14.335786+00
5	6949305a20cfb2025b9fa12f	ORDER_2_1766404186380	1	2	29800	-2	5	1766404186142	1766404194360	1766404200148	{"user_id": "1", "order_id": "2"}	2025-12-22 11:49:46.374407+00	2025-12-22 11:50:00.148081+00
6	69493d8320cfb2025b9fa195	ORDER_2_1766407555482	1	2	29800	-2	5	1766407555267	1766407565023	1766407570037	{"order_id": "2", "user_id": "1"}	2025-12-22 12:45:55.473699+00	2025-12-22 12:46:10.037195+00
7	69493f3c20cfb2025b9fa1a3	ORDER_31_1766407996956	5	31	5000000	-1	3	1766407996748	\N	1766408001931	{"order_id": "31", "user_id": "5"}	2025-12-22 12:53:16.953831+00	2025-12-22 12:53:21.931226+00
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, variant_id, image_url, "order", created_at) FROM stdin;
1	1	http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp	0	2025-12-15 00:41:03.030354+00
2	1	http://147.45.155.163:8000/uploads/images/4a804d8d-50bb-48cb-8daf-f2a3be3dcd2d.webp	1	2025-12-15 00:41:03.030354+00
3	1	http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp	2	2025-12-15 00:41:03.030354+00
120	28	https://libertywear.uz/uploads/images/b00454cb-4fb2-4031-8051-ad8345a012b9.png	0	2025-12-20 23:29:37.459846+00
121	28	https://libertywear.uz/uploads/images/0981bed2-4cf2-4580-9f7e-1c31e361a5b2.png	1	2025-12-20 23:29:37.459846+00
122	28	https://libertywear.uz/uploads/images/33f03bf5-2170-4533-9341-36231ae00381.png	2	2025-12-20 23:29:37.459846+00
123	28	https://libertywear.uz/uploads/images/59ff5f53-11d4-4489-bbb4-3cb2c4292117.png	3	2025-12-20 23:29:37.459846+00
8	3	http://147.45.155.163:8000/uploads/images/34f8d112-b926-4a64-9ec7-d36fba31b53b.webp	0	2025-12-15 01:12:48.239711+00
9	3	http://147.45.155.163:8000/uploads/images/b7be68c8-f2ee-4cd3-8c44-2dfd8dc4bc26.webp	1	2025-12-15 01:12:48.239711+00
10	3	http://147.45.155.163:8000/uploads/images/dd1ba6b7-588c-4534-91a9-f122fc97a83b.webp	2	2025-12-15 01:12:48.239711+00
11	3	http://147.45.155.163:8000/uploads/images/46520ea1-83c3-4ad6-b5bb-5b55755efc92.webp	3	2025-12-15 01:12:48.239711+00
124	28	https://libertywear.uz/uploads/images/8a490374-83df-4f85-a90a-58b140709198.png	4	2025-12-20 23:29:37.459846+00
125	29	https://libertywear.uz/uploads/images/d5225d35-ea66-44ba-b31b-92fb17e5a5f8.png	0	2025-12-20 23:30:52.360612+00
126	29	https://libertywear.uz/uploads/images/a5f70a8d-7e03-485e-89b3-c0cba523ceb4.png	1	2025-12-20 23:30:52.360612+00
127	29	https://libertywear.uz/uploads/images/4264bf14-5f71-4a69-b10a-c20f100cb988.png	2	2025-12-20 23:30:52.360612+00
128	29	https://libertywear.uz/uploads/images/1b2ae1e3-a72b-4179-beda-94820d8c78b5.png	3	2025-12-20 23:30:52.360612+00
18	6	http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp	0	2025-12-15 01:19:35.904299+00
19	6	http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp	1	2025-12-15 01:19:35.904299+00
20	6	http://147.45.155.163:8000/uploads/images/4a804d8d-50bb-48cb-8daf-f2a3be3dcd2d.webp	2	2025-12-15 01:19:35.904299+00
24	8	http://147.45.155.163:8000/uploads/images/aa49320b-3b67-4f76-8085-695ab90cf2b9.webp	0	2025-12-15 01:20:51.942853+00
25	8	http://147.45.155.163:8000/uploads/images/2a79a3fc-ba91-40d1-abdb-f08c33295d59.webp	1	2025-12-15 01:20:51.942853+00
26	8	http://147.45.155.163:8000/uploads/images/4a804d8d-50bb-48cb-8daf-f2a3be3dcd2d.webp	2	2025-12-15 01:20:51.942853+00
27	9	http://147.45.155.163:8000/uploads/images/03dd9f66-0c5a-406e-9d03-a0ce37a8a5ed.webp	0	2025-12-15 04:45:17.512706+00
28	9	http://147.45.155.163:8000/uploads/images/8d19a6e8-07b6-4bd8-a3fb-947bec986f18.webp	1	2025-12-15 04:45:17.512706+00
29	9	http://147.45.155.163:8000/uploads/images/c5344680-3b69-42d5-8c56-320e1328c988.webp	2	2025-12-15 04:45:17.512706+00
30	9	http://147.45.155.163:8000/uploads/images/f8bafe42-c615-4324-a164-1fb4fbc1b162.webp	3	2025-12-15 04:45:17.512706+00
31	9	http://147.45.155.163:8000/uploads/images/868cd8dc-aaea-4a43-9c3f-fcf8519e8072.webp	4	2025-12-15 04:45:17.512706+00
32	9	http://147.45.155.163:8000/uploads/images/d52ab464-9e37-48ce-9c54-9f1ef2b43029.webp	5	2025-12-15 04:45:17.512706+00
159	36	http://147.45.155.163:8000/uploads/images/6267cf36-0a65-4ab6-b05d-00917eafa641.jpg	0	2025-12-23 04:58:54.977312+00
160	36	http://147.45.155.163:8000/uploads/images/7a708117-9031-4cbe-8dec-7702e4fbc289.jpg	1	2025-12-23 04:58:54.977312+00
161	36	http://147.45.155.163:8000/uploads/images/ca8a3d33-7859-4d9f-8500-69b22294185d.jpg	2	2025-12-23 04:58:54.977312+00
162	36	http://147.45.155.163:8000/uploads/images/2045c68c-2ede-4cc5-be87-a5ced3207e6d.jpg	3	2025-12-23 04:58:54.977312+00
167	38	http://147.45.155.163:8000/uploads/images/521b25a8-7f66-4ebf-8fa7-3d3d32e97496.jpg	0	2025-12-23 05:13:47.87345+00
168	38	http://147.45.155.163:8000/uploads/images/cb7803c4-3ed5-4666-9dc0-2f35585c4aae.jpg	1	2025-12-23 05:13:47.87345+00
169	38	http://147.45.155.163:8000/uploads/images/58afb6a4-3d6f-4183-9332-c1d23b5bd4e3.jpg	2	2025-12-23 05:13:47.87345+00
170	39	http://147.45.155.163:8000/uploads/images/3ada3071-1e98-4ed1-9dfb-6263241b7b61.jpg	0	2025-12-23 05:19:40.007083+00
171	39	http://147.45.155.163:8000/uploads/images/a6e97eb5-cc53-4435-b004-eb91d4e9ed4b.jpg	1	2025-12-23 05:19:40.007083+00
172	39	http://147.45.155.163:8000/uploads/images/ba443605-a659-4a3b-846f-e0a46c73e79e.jpg	2	2025-12-23 05:19:40.007083+00
204	49	http://147.45.155.163:8000/uploads/images/b7d0fd7b-ae5c-4e06-b088-901aa1958c32.jpg	0	2025-12-23 08:31:09.542279+00
205	49	http://147.45.155.163:8000/uploads/images/9530f05d-a921-4975-9df2-e77d5f61f9e9.jpg	1	2025-12-23 08:31:09.542279+00
206	50	https://libertywear.uz/uploads/images/5e0e607e-7344-4e95-bbb9-939e72c2b7b8.jpg	0	2025-12-23 08:40:28.811593+00
207	50	https://libertywear.uz/uploads/images/40596f63-f22d-4d37-ad32-8ce230f4d816.jpg	1	2025-12-23 08:40:28.811593+00
237	56	http://147.45.155.163:8000/uploads/images/8fb1553c-fcc8-416b-8887-a7dc137120cf.png	0	2025-12-23 12:15:59.812362+00
238	56	http://147.45.155.163:8000/uploads/images/c2c4eca3-0756-4bb8-ad33-315942c87b2f.png	1	2025-12-23 12:15:59.812362+00
239	56	http://147.45.155.163:8000/uploads/images/2ed11bcb-abc3-449e-8922-3bb75af60dd9.png	2	2025-12-23 12:15:59.812362+00
240	56	http://147.45.155.163:8000/uploads/images/b76323ac-fcc5-43bf-a053-4f2eb023db88.png	3	2025-12-23 12:15:59.812362+00
103	25	https://libertywear.uz/uploads/images/a841d2a9-0ae7-4dc1-9cf2-7de4051db729.png	0	2025-12-20 23:27:32.616177+00
104	25	https://libertywear.uz/uploads/images/1adcc8eb-28ba-4132-bc93-e786402b3dc9.png	1	2025-12-20 23:27:32.616177+00
105	25	https://libertywear.uz/uploads/images/feb29754-8662-44b7-ab88-c5a95cae5712.png	2	2025-12-20 23:27:32.616177+00
106	25	https://libertywear.uz/uploads/images/da2e0a7d-a2e0-4edf-9d0f-8048b48e7b25.png	3	2025-12-20 23:27:32.616177+00
107	25	https://libertywear.uz/uploads/images/23d7ab49-1b43-4a1f-813d-6ab84f563a69.png	4	2025-12-20 23:27:32.616177+00
108	26	https://libertywear.uz/uploads/images/bbdbacf2-f4cd-4704-8193-6f88a200beb9.png	0	2025-12-20 23:27:47.323046+00
109	26	https://libertywear.uz/uploads/images/a1fa5ef0-a314-4a33-8562-1daee3d0371f.png	1	2025-12-20 23:27:47.323046+00
110	26	https://libertywear.uz/uploads/images/08ecefe7-9da7-4fd9-bc4d-9e4ee325a481.png	2	2025-12-20 23:27:47.323046+00
111	26	https://libertywear.uz/uploads/images/f642ee13-8cdf-4f1b-8d9e-49f537fe0ff2.png	3	2025-12-20 23:27:47.323046+00
112	26	https://libertywear.uz/uploads/images/adbfffe9-90ff-4008-953c-7a2975c0ddd5.png	4	2025-12-20 23:27:47.323046+00
113	26	https://libertywear.uz/uploads/images/100e9239-0813-4eea-aec4-5f2e882d5e53.png	5	2025-12-20 23:27:47.323046+00
114	26	https://libertywear.uz/uploads/images/9112dbc6-b4f0-4d7d-b481-42f0df08605d.png	6	2025-12-20 23:27:47.323046+00
115	27	https://libertywear.uz/uploads/images/3af292cd-0429-4dd3-ada0-35dc02948d4f.png	0	2025-12-20 23:28:23.132371+00
116	27	https://libertywear.uz/uploads/images/5a2e7e30-7a1c-4c9b-832b-eba82d399511.jpg	1	2025-12-20 23:28:23.132371+00
117	27	https://libertywear.uz/uploads/images/3154a209-7aab-4fce-adbb-33dbfb2b1e12.jpg	2	2025-12-20 23:28:23.132371+00
118	27	https://libertywear.uz/uploads/images/f9958d26-c21a-4a92-bc49-95480e9302e4.jpg	3	2025-12-20 23:28:23.132371+00
119	27	https://libertywear.uz/uploads/images/b2870682-cc6a-4154-bbbd-78fb502975ed.jpg	4	2025-12-20 23:28:23.132371+00
136	32	http://147.45.155.163:8000/uploads/images/7a322521-b293-4773-8c07-9259cc7227f8.jpg	0	2025-12-23 04:30:36.87538+00
137	32	http://147.45.155.163:8000/uploads/images/317b099f-88be-4712-959c-a1d7d61f1617.jpg	1	2025-12-23 04:30:36.87538+00
138	32	http://147.45.155.163:8000/uploads/images/486eab2e-f7c8-45fc-abac-476055cea6b4.jpg	2	2025-12-23 04:30:36.87538+00
139	32	http://147.45.155.163:8000/uploads/images/8890edd4-4b83-4765-8253-1564f11276f8.jpg	3	2025-12-23 04:30:36.87538+00
140	32	http://147.45.155.163:8000/uploads/images/69f96721-1d6f-4cc1-8468-f8e684db7d3d.jpg	4	2025-12-23 04:30:36.87538+00
141	32	http://147.45.155.163:8000/uploads/images/372e77f3-9ac8-4139-ac33-5020ec48fa3d.jpg	5	2025-12-23 04:30:36.87538+00
154	35	http://147.45.155.163:8000/uploads/images/20649a22-6c4b-49ca-8b15-08429f9dd148.jpg	0	2025-12-23 04:53:05.637258+00
155	35	http://147.45.155.163:8000/uploads/images/de2d7775-1615-41b3-b231-fc6e00d7059f.jpg	1	2025-12-23 04:53:05.637258+00
156	35	http://147.45.155.163:8000/uploads/images/dcb05dcf-de0f-416d-945c-4be53e3defa8.jpg	2	2025-12-23 04:53:05.637258+00
157	35	http://147.45.155.163:8000/uploads/images/5449c032-ebb5-4022-9796-f5ba7fb8365f.jpg	3	2025-12-23 04:53:05.637258+00
158	35	http://147.45.155.163:8000/uploads/images/f63cc82b-6713-4283-869c-cd2c9d00debf.jpg	4	2025-12-23 04:53:05.637258+00
163	37	http://147.45.155.163:8000/uploads/images/ad29512b-3e71-48e8-8d5b-f3103084d855.jpg	0	2025-12-23 05:05:52.154227+00
164	37	http://147.45.155.163:8000/uploads/images/9864e723-3c1e-4a07-bf82-44d094353f87.jpg	1	2025-12-23 05:05:52.154227+00
165	37	http://147.45.155.163:8000/uploads/images/d0ddccc5-41ba-422c-a608-ab178f50fedc.jpg	2	2025-12-23 05:05:52.154227+00
166	37	http://147.45.155.163:8000/uploads/images/6085c31e-6a7b-4113-a1c7-e102db24a6f2.jpg	3	2025-12-23 05:05:52.154227+00
173	40	http://147.45.155.163:8000/uploads/images/60df1b6b-c2ce-4149-8ae7-9601509358fb.jpg	0	2025-12-23 05:19:43.788733+00
174	40	http://147.45.155.163:8000/uploads/images/b5332bd2-1988-45bb-bc57-3c7198076a4f.jpg	1	2025-12-23 05:19:43.788733+00
175	40	http://147.45.155.163:8000/uploads/images/7ef6ded3-32d7-4da1-bdf1-fd6a4874910b.jpg	2	2025-12-23 05:19:43.788733+00
176	41	http://147.45.155.163:8000/uploads/images/bee19d19-4548-48c5-b4cb-e56bc44981ad.jpg	0	2025-12-23 05:19:49.19269+00
177	41	http://147.45.155.163:8000/uploads/images/62d8c411-4dc8-4975-b745-73bba017bb48.jpg	1	2025-12-23 05:19:49.19269+00
178	41	http://147.45.155.163:8000/uploads/images/40d05755-d250-43ed-a370-c09673243636.jpg	2	2025-12-23 05:19:49.19269+00
300	73	https://libertywear.uz/uploads/images/835b2fd7-12fb-40e3-8e1c-57a35ba47dde.png	0	2025-12-26 06:07:29.392904+00
301	73	https://libertywear.uz/uploads/images/a73590c3-c01b-40ad-87e1-17a67754bdcf.png	1	2025-12-26 06:07:29.392904+00
302	73	https://libertywear.uz/uploads/images/2c730749-98e7-4d50-9171-44c62069afa3.png	2	2025-12-26 06:07:29.392904+00
182	43	https://libertywear.uz/uploads/images/52fb0645-8951-438c-bf39-cd782bfb4ca8.jpg	0	2025-12-23 05:23:00.175651+00
183	43	http://147.45.155.163:8000/uploads/images/28ae34df-9b2c-4d1e-ba2f-04c069925805.jpg	1	2025-12-23 05:23:00.175651+00
184	43	http://147.45.155.163:8000/uploads/images/dbbefb23-d3a0-40b9-9b8d-a0bcbb950b88.jpg	2	2025-12-23 05:23:00.175651+00
185	43	http://147.45.155.163:8000/uploads/images/710ce5d7-403f-456d-932b-babd277f540a.jpg	3	2025-12-23 05:23:00.175651+00
186	44	http://147.45.155.163:8000/uploads/images/cf5db1dd-0d41-4468-8c8b-2deca815ae67.jpg	0	2025-12-23 05:29:58.352653+00
187	44	http://147.45.155.163:8000/uploads/images/9685aba0-2fa6-475a-9657-d486ff1c9c9e.jpg	1	2025-12-23 05:29:58.352653+00
188	44	http://147.45.155.163:8000/uploads/images/7ece9332-aeed-453e-b8cb-f13f58818330.jpg	2	2025-12-23 05:29:58.352653+00
189	44	http://147.45.155.163:8000/uploads/images/b2243e94-a8c2-44b7-a757-5a7a75167f79.jpg	3	2025-12-23 05:29:58.352653+00
303	73	https://libertywear.uz/uploads/images/5cea161f-bbc7-4317-a05b-952f296b4473.png	3	2025-12-26 06:07:29.392904+00
304	74	https://libertywear.uz/api/uploads/images/6ca295e2-51ab-4a82-94f6-818afd16276e.jpg	0	2025-12-26 06:07:29.392904+00
305	74	https://libertywear.uz/api/uploads/images/557016b9-b0d1-4b53-96c2-dcf561ba944b.jpg	1	2025-12-26 06:07:29.392904+00
306	74	https://libertywear.uz/api/uploads/images/e4a24f94-bd2c-479c-989e-9b7568e9c536.jpg	2	2025-12-26 06:07:29.392904+00
307	74	https://libertywear.uz/api/uploads/images/3208b42e-f4f2-44ea-b66d-670dc83955d1.jpg	3	2025-12-26 06:07:29.392904+00
308	74	https://libertywear.uz/api/uploads/images/9dff1fca-2884-4125-9a6c-93b60eb84a11.jpg	4	2025-12-26 06:07:29.392904+00
208	50	https://libertywear.uz/uploads/images/8b8fbfc7-0f0c-4fda-9c1e-37f895f80363.jpg	2	2025-12-23 08:40:28.811593+00
209	50	https://libertywear.uz/uploads/images/94885fca-fac6-4eb9-8239-b8bbe5235ed5.jpg	3	2025-12-23 08:40:28.811593+00
210	50	https://libertywear.uz/uploads/images/1495f554-8a17-4802-8763-ebce679f87b9.jpg	4	2025-12-23 08:40:28.811593+00
309	75	https://libertywear.uz/api/uploads/images/8f600101-ef05-4296-8b2b-3a246c9e8749.jpg	0	2025-12-26 06:23:21.419419+00
310	75	https://libertywear.uz/api/uploads/images/2de0f547-45eb-4d1a-8993-e0b03cb4b274.jpg	1	2025-12-26 06:23:21.419419+00
311	75	https://libertywear.uz/api/uploads/images/2412a12f-9f69-40f9-a861-aa489f6f5b06.jpg	2	2025-12-26 06:23:21.419419+00
312	75	https://libertywear.uz/api/uploads/images/f53532f9-ddaa-4333-a21f-7316385b3bb5.jpg	3	2025-12-26 06:23:21.419419+00
215	52	http://147.45.155.163:8000/uploads/images/b84b16e3-25fd-4b10-a964-817850115bfb.jpg	0	2025-12-23 12:05:37.697659+00
216	52	http://147.45.155.163:8000/uploads/images/4896f41c-b955-4669-b7c7-ffdcb684460d.jpg	1	2025-12-23 12:05:37.697659+00
217	52	http://147.45.155.163:8000/uploads/images/5b1687de-e4ac-4d3a-b052-9bde73db9fc1.jpg	2	2025-12-23 12:05:37.697659+00
218	52	http://147.45.155.163:8000/uploads/images/25f59adb-8701-4243-8f1d-1a12b0727727.jpg	3	2025-12-23 12:05:37.697659+00
219	52	http://147.45.155.163:8000/uploads/images/afe52a61-9c83-4ac5-ac38-2d7bace2a9d5.jpg	4	2025-12-23 12:05:37.697659+00
220	52	http://147.45.155.163:8000/uploads/images/c81e4372-e37b-4b2d-9e8c-cf76228ec8fa.jpg	5	2025-12-23 12:05:37.697659+00
313	76	https://libertywear.uz/api/uploads/images/29ba528d-851d-4d69-b88f-56c7028d1e55.jpg	0	2025-12-26 06:23:21.419419+00
314	76	https://libertywear.uz/api/uploads/images/6e7df74a-15e5-4fc9-b48b-3b5998eb8b7b.jpg	1	2025-12-26 06:23:21.419419+00
315	76	https://libertywear.uz/api/uploads/images/aabb1872-75c7-4903-b5b9-f4266c3316c9.jpg	2	2025-12-26 06:23:21.419419+00
316	76	https://libertywear.uz/api/uploads/images/4b4aac93-27a3-4335-a314-740a8e0ba5f1.jpg	3	2025-12-26 06:23:21.419419+00
317	77	https://libertywear.uz/api/uploads/images/08b92e58-5c83-4276-91c7-a9a7daca9209.jpg	0	2025-12-26 09:50:52.400392+00
318	78	https://libertywear.uz/api/uploads/images/462859d0-ffa6-4d33-b5c1-55cfb451eaec.png	0	2025-12-26 12:45:27.189116+00
227	54	http://147.45.155.163:8000/uploads/images/ea296948-6505-4e3a-9ae2-6f2013a08d10.jpg	0	2025-12-23 12:06:18.376661+00
228	54	http://147.45.155.163:8000/uploads/images/4ab9c32b-d574-4ce8-849f-a8cd86bc4619.jpg	1	2025-12-23 12:06:18.376661+00
229	54	http://147.45.155.163:8000/uploads/images/f7a46795-dafb-4d85-9b52-8419f526d60e.jpg	2	2025-12-23 12:06:18.376661+00
230	54	http://147.45.155.163:8000/uploads/images/a6a8b1a0-6fb0-438c-8a3d-c4c559c55e32.jpg	3	2025-12-23 12:06:18.376661+00
231	54	http://147.45.155.163:8000/uploads/images/28142418-4671-470c-bbf8-d9278a249c3e.jpg	4	2025-12-23 12:06:18.376661+00
232	54	http://147.45.155.163:8000/uploads/images/cb98a66b-065d-4fd6-be3e-4b8c307d02d5.jpg	5	2025-12-23 12:06:18.376661+00
233	55	https://libertywear.uz/uploads/images/d7bb2a4f-ed06-4fde-b91e-681a972160b2.png	0	2025-12-23 12:09:00.623843+00
234	55	https://libertywear.uz/uploads/images/da65bc13-50c6-41af-a826-cff6edc4e882.png	1	2025-12-23 12:09:00.623843+00
235	55	https://libertywear.uz/uploads/images/38fc23bb-9162-4753-bba1-e378911af83b.png	2	2025-12-23 12:09:00.623843+00
236	55	https://libertywear.uz/uploads/images/dae03a06-7fe9-40ef-81b6-66bb6d046697.png	3	2025-12-23 12:09:00.623843+00
322	80	https://libertywear.uz/api/uploads/images/08b92e58-5c83-4276-91c7-a9a7daca9209.jpg	0	2025-12-27 04:38:18.435811+00
245	58	https://libertywear.uz/uploads/images/0432d2d9-5643-4067-afa4-0c4ee3abb0b1.jpg	0	2025-12-24 09:04:39.929267+00
246	58	https://libertywear.uz/uploads/images/7c49decb-2ec8-42ff-a4b1-c69ce1529e11.jpg	1	2025-12-24 09:04:39.929267+00
247	58	https://libertywear.uz/uploads/images/12e59fe5-0f62-4ede-838a-9157e4ef8b7e.jpg	2	2025-12-24 09:04:39.929267+00
248	58	https://libertywear.uz/uploads/images/cfbd59c7-8910-45a0-be79-f266c102b5f8.jpg	3	2025-12-24 09:04:39.929267+00
249	58	https://libertywear.uz/uploads/images/b2655a25-d71b-4b9f-b7cb-6bc71293c60d.jpg	4	2025-12-24 09:04:39.929267+00
250	58	https://libertywear.uz/uploads/images/097b08d1-166b-4990-89ba-36a9f533bcd2.jpg	5	2025-12-24 09:04:39.929267+00
251	62	https://libertywear.uz/uploads/images/f19791d8-d82d-4660-beec-317356e45931.png	0	2025-12-25 09:20:08.294424+00
252	62	https://libertywear.uz/uploads/images/e96e9f81-fa86-4581-a00a-5da85a45d33b.png	1	2025-12-25 09:20:08.294424+00
253	62	https://libertywear.uz/uploads/images/19445334-eb33-4a2d-b923-78494f67d0fd.png	2	2025-12-25 09:20:08.294424+00
254	62	https://libertywear.uz/uploads/images/f3c77fc6-0a28-417e-9f3d-c1dc9653cdbf.png	3	2025-12-25 09:20:08.294424+00
325	82	https://libertywear.uz/uploads/images/6b55e479-b5be-4c0f-bfd5-05cb9a235ea1.png	0	2025-12-27 04:43:32.668324+00
326	82	https://libertywear.uz/uploads/images/b1967608-821c-487d-addb-6b4c8619fd9f.png	1	2025-12-27 04:43:32.668324+00
327	82	https://libertywear.uz/uploads/images/605b8f40-7dd6-45b1-ada5-8c36d4f7613f.png	2	2025-12-27 04:43:32.668324+00
330	86	https://libertywear.uz/api/uploads/images/94807a82-036a-4cb4-8ad8-e44107cc37e3.png	0	2025-12-27 08:21:52.302355+00
336	90	https://libertywear.uz/api/uploads/images/f0f2a7c2-b757-4aa0-985b-1ba93fde4fc9.png	0	2025-12-27 09:26:08.961185+00
337	90	https://libertywear.uz/api/uploads/images/ec977da1-fca8-49b9-b563-891fb52d06f3.png	1	2025-12-27 09:26:08.961185+00
338	90	https://libertywear.uz/api/uploads/images/5f9f3645-4353-4cb8-bb66-12cb0e382e8a.png	2	2025-12-27 09:26:08.961185+00
339	90	https://libertywear.uz/api/uploads/images/54496440-bee4-4381-b96f-878e5d386d12.png	3	2025-12-27 09:26:08.961185+00
340	90	https://libertywear.uz/api/uploads/images/530b1176-5171-4e51-bd35-f40015a3f136.png	4	2025-12-27 09:26:08.961185+00
341	90	https://libertywear.uz/api/uploads/images/e5dbe4c3-4456-463c-a0c6-e6b7aecc8e60.png	5	2025-12-27 09:26:08.961185+00
344	92	https://libertywear.uz/api/uploads/images/83e447ef-67b2-4764-9e8f-7098ba51c39f.png	0	2025-12-27 09:52:57.666536+00
345	92	https://libertywear.uz/api/uploads/images/c77cd8c8-1919-4a25-9305-3d7d204fd3cf.png	1	2025-12-27 09:52:57.666536+00
346	92	https://libertywear.uz/api/uploads/images/218671d9-4582-4d2f-84f5-52c316b79009.png	2	2025-12-27 09:52:57.666536+00
347	94	https://libertywear.uz/api/uploads/images/d2b2f4eb-d3b3-4cca-9ef0-90bd1dcc1743.png	0	2025-12-27 10:28:19.476752+00
348	94	https://libertywear.uz/api/uploads/images/4bbe8653-c0f3-4523-b53c-8c097f88b7af.png	1	2025-12-27 10:28:19.476752+00
349	95	https://libertywear.uz/api/uploads/images/be4fc391-cf6b-4c45-a5b3-5d917919177a.png	0	2025-12-29 07:20:21.108383+00
350	95	https://libertywear.uz/api/uploads/images/609aec1b-a938-48dd-92ec-15f66d8c6575.png	1	2025-12-29 07:20:21.108383+00
351	96	https://libertywear.uz/uploads/images/ebba82d2-93f2-447e-a476-e369eb1640fe.png	0	2025-12-29 07:20:53.257523+00
352	97	https://libertywear.uz/api/uploads/images/518b7933-2753-4f5b-8f54-373ae29ec4e2.png	0	2025-12-29 07:21:10.768391+00
353	97	https://libertywear.uz/api/uploads/images/015daae2-0206-4146-8d51-9f20310457e2.png	1	2025-12-29 07:21:10.768391+00
354	97	https://libertywear.uz/api/uploads/images/6c1838b8-4814-405e-ac8f-227cd628adfd.png	2	2025-12-29 07:21:10.768391+00
355	98	https://libertywear.uz/uploads/images/867c64f6-623c-459f-9603-88eaf0fd3766.jpg	0	2025-12-29 07:21:34.765228+00
356	98	https://libertywear.uz/uploads/images/090afc1f-93e6-4732-aa1e-d01d4ec2bf91.jpg	1	2025-12-29 07:21:34.765228+00
357	98	https://libertywear.uz/uploads/images/e2f6ac89-23d1-4b90-9c74-909b1ea67847.jpg	2	2025-12-29 07:21:34.765228+00
358	98	https://libertywear.uz/uploads/images/dcbe5ab4-1a06-4cce-8ada-d99f4f3fc9f6.jpg	3	2025-12-29 07:21:34.765228+00
359	99	https://libertywear.uz/uploads/images/459c3eb5-b1ad-456c-b1a3-9ee22eda0b68.jpg	0	2025-12-29 07:21:51.636926+00
360	99	https://libertywear.uz/uploads/images/99785558-3693-42ad-b4db-b5af0500775b.jpg	1	2025-12-29 07:21:51.636926+00
361	99	https://libertywear.uz/uploads/images/d7469c67-1591-42c5-82b5-7cf61d4af4fe.jpg	2	2025-12-29 07:21:51.636926+00
362	99	https://libertywear.uz/uploads/images/7159251f-2f1a-48fd-8d7b-3ff7a491d00f.jpg	3	2025-12-29 07:21:51.636926+00
363	99	https://libertywear.uz/uploads/images/7beb79d2-7334-4f54-a54a-88bd9c196fda.jpg	4	2025-12-29 07:21:51.636926+00
364	99	https://libertywear.uz/uploads/images/d08a5753-0212-4e17-ab5f-31d0d379a87f.jpg	5	2025-12-29 07:21:51.636926+00
365	100	https://libertywear.uz/uploads/images/13902410-4777-4f4e-89c4-6ddbfc240f24.jpg	0	2025-12-29 07:22:04.088659+00
366	100	https://libertywear.uz/uploads/images/9d90380c-e29b-4f0f-9c30-337bdc53168b.jpg	1	2025-12-29 07:22:04.088659+00
367	100	https://libertywear.uz/uploads/images/02a883af-bf02-42b5-9f95-c3d23bfc670a.jpg	2	2025-12-29 07:22:04.088659+00
368	100	https://libertywear.uz/uploads/images/5a8ae0e7-73de-4e65-912e-359dd92d7359.jpg	3	2025-12-29 07:22:04.088659+00
369	100	https://libertywear.uz/uploads/images/faec968d-c1c4-433f-8f38-1023634e7354.jpg	4	2025-12-29 07:22:04.088659+00
370	100	https://libertywear.uz/uploads/images/0cb62203-7031-45d2-9386-ed97136e5414.jpg	5	2025-12-29 07:22:04.088659+00
375	102	https://libertywear.uz/api/uploads/images/f316872e-7123-4173-a2a5-4d7335177a8f.jpg	0	2025-12-29 19:38:11.644798+00
376	102	https://libertywear.uz/api/uploads/images/87c5aca7-fdba-47af-ab7a-f1ec758a6584.jpg	1	2025-12-29 19:38:11.644798+00
377	102	https://libertywear.uz/api/uploads/images/7ac662cc-f1da-4ddb-bde9-3e443a00e463.jpg	2	2025-12-29 19:38:11.644798+00
378	102	https://libertywear.uz/api/uploads/images/d550284f-aeb7-42f1-8d7a-81aa5798c33b.jpg	3	2025-12-29 19:38:11.644798+00
387	105	https://libertywear.uz/api/uploads/images/f316872e-7123-4173-a2a5-4d7335177a8f.jpg	0	2025-12-29 19:54:19.434823+00
388	105	https://libertywear.uz/api/uploads/images/87c5aca7-fdba-47af-ab7a-f1ec758a6584.jpg	1	2025-12-29 19:54:19.434823+00
389	105	https://libertywear.uz/api/uploads/images/7ac662cc-f1da-4ddb-bde9-3e443a00e463.jpg	2	2025-12-29 19:54:19.434823+00
390	105	https://libertywear.uz/api/uploads/images/d550284f-aeb7-42f1-8d7a-81aa5798c33b.jpg	3	2025-12-29 19:54:19.434823+00
391	106	https://libertywear.uz/api/uploads/images/3f2ec105-f5c5-4382-bad0-9b1b6dc76845.jpg	0	2025-12-29 20:10:09.637035+00
392	106	https://libertywear.uz/api/uploads/images/2e721de9-e74f-4de0-98e5-4424d02d5c94.jpg	1	2025-12-29 20:10:09.637035+00
393	106	https://libertywear.uz/api/uploads/images/42dea26a-8ad0-489d-9f5d-cdf1cb9f6fd7.jpg	2	2025-12-29 20:10:09.637035+00
394	106	https://libertywear.uz/api/uploads/images/bde0ee9b-88c1-435c-8080-c73fcca3d005.jpg	3	2025-12-29 20:10:09.637035+00
395	107	https://libertywear.uz/api/uploads/images/3774c384-74ab-40d5-9e0a-2c3974170ddd.jpg	0	2025-12-30 03:14:28.09635+00
396	107	https://libertywear.uz/api/uploads/images/70c0e204-591c-4883-a281-dd5234922dde.jpg	1	2025-12-30 03:14:28.09635+00
397	107	https://libertywear.uz/api/uploads/images/17986057-3b94-40c8-9cc1-0b6570781a86.jpg	2	2025-12-30 03:14:28.09635+00
398	107	https://libertywear.uz/api/uploads/images/36124366-ea00-4dae-847d-a113931b8819.jpg	3	2025-12-30 03:14:28.09635+00
399	107	https://libertywear.uz/api/uploads/images/5c3f07a5-d089-45b4-a69b-1053107bca69.jpg	4	2025-12-30 03:14:28.09635+00
405	109	https://libertywear.uz/api/uploads/images/3cbfcb30-84f7-4d7f-8ea0-021f4a3fb83e.jpg	0	2025-12-30 03:26:57.610639+00
406	109	https://libertywear.uz/api/uploads/images/f520cb0c-da42-4f46-9ce2-8f0016805197.jpg	1	2025-12-30 03:26:57.610639+00
407	109	https://libertywear.uz/api/uploads/images/c005168b-cbbf-45e1-aae6-d5063860faa5.jpg	2	2025-12-30 03:26:57.610639+00
408	109	https://libertywear.uz/api/uploads/images/00291953-ae4f-4528-86e9-db6c65cd8d7e.jpg	3	2025-12-30 03:26:57.610639+00
409	109	https://libertywear.uz/api/uploads/images/5f84d2fb-177e-4dfa-9262-f5ef2394306f.jpg	4	2025-12-30 03:26:57.610639+00
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, product_id, color_name, color_image, price, stock, size_stock, sizes, created_at, updated_at) FROM stdin;
1	1	Midnight Black	http://147.45.155.163:8000/uploads/images/84c502c2-c425-4db5-a07b-8afa90ecbb17.webp	298	0	{"M": 10, "L": 10, "S": 12}	["M", "L", "S"]	2025-12-15 00:41:03.030354+00	\N
3	2	Cloud Grey	http://147.45.155.163:8000/uploads/images/356e4938-ff5d-4f1e-8ebe-175e5098762a.webp	300000	0	{"M": 100, "L": 100}	["M", "L"]	2025-12-15 01:12:48.239711+00	\N
6	3	Midnight Black	http://147.45.155.163:8000/uploads/images/84c502c2-c425-4db5-a07b-8afa90ecbb17.webp	298	0	{"M": 10, "L": 10, "S": 12}	["M", "L", "S"]	2025-12-15 01:19:35.904299+00	\N
8	4	Midnight Black	http://147.45.155.163:8000/uploads/images/84c502c2-c425-4db5-a07b-8afa90ecbb17.webp	298	0	{"M": 10, "L": 10, "S": 12}	["M", "L", "S"]	2025-12-15 01:20:51.942853+00	\N
9	5	черный 	http://147.45.155.163:8000/uploads/images/67cf0592-dcb6-41c6-a264-a3470b27b905.webp	299994	0	{"S": 10, "M": 10}	["S", "M"]	2025-12-15 04:45:17.512706+00	\N
25	12	Розивий	https://libertywear.uz/uploads/images/b8f74abd-8bce-43bd-a898-e1f134a88610.png	300000	0	{}	["S", "M"]	2025-12-20 23:27:32.616177+00	\N
26	10	Галубой	https://libertywear.uz/uploads/images/3a791ceb-914d-492e-bc5d-1d5c11d67db8.jpg	370000	0	{}	[]	2025-12-20 23:27:47.323046+00	\N
27	8	Seriy	https://libertywear.uz/uploads/images/9ec3574e-6fc6-4a81-91ce-e37585aec899.png	350000	0	{}	["S", "M"]	2025-12-20 23:28:23.132371+00	\N
28	11	Розивий	https://libertywear.uz/uploads/images/ca735839-2dd4-47a1-a69d-fb023fd5dd40.png	340000	0	{}	["S", "M"]	2025-12-20 23:29:37.459846+00	\N
29	13	черний	https://libertywear.uz/uploads/images/72a61cd9-c21f-4aba-b755-7e5252412b74.png	400000	0	{}	["XS", "M", "L", "S"]	2025-12-20 23:30:52.360612+00	\N
32	16	Галубой	http://147.45.155.163:8000/uploads/images/c15f9105-938b-418b-8ae6-6daa7adc0ab9.jpg	3800000	0	{}	["S", "M", "L", "XL"]	2025-12-23 04:30:36.87538+00	\N
35	19	Черний	http://147.45.155.163:8000/uploads/images/8f2204bf-e7bd-4b2b-8308-e4a30aacc801.jpg	399999	0	{}	["S", "M", "L"]	2025-12-23 04:53:05.637258+00	\N
36	20	Белый	http://147.45.155.163:8000/uploads/images/f6293ed6-b79e-4579-baf4-08734861a79b.jpg	420000	0	{}	["XS", "S", "M", "L"]	2025-12-23 04:58:54.977312+00	\N
37	21	Галубой	http://147.45.155.163:8000/uploads/images/76c91fae-ccc5-42cb-8de7-286b4d7dfc0a.jpg	380000	0	{}	["S", "M", "L", "XL", "XXL"]	2025-12-23 05:05:52.154227+00	\N
38	22	Бежевый	http://147.45.155.163:8000/uploads/images/61abe740-d5d8-46bd-8080-2815223d0e15.jpg	310000	0	{}	["XS", "S", "M", "L"]	2025-12-23 05:13:47.87345+00	\N
39	23	Бежевый	http://147.45.155.163:8000/uploads/images/95b6dc94-915e-4ae1-8d86-bf70980d47ba.jpg	310000	0	{}	["XS", "S", "M", "L"]	2025-12-23 05:19:40.007083+00	\N
40	24	Бежевый	http://147.45.155.163:8000/uploads/images/cf8e6ffd-de8d-4d57-bf80-24f1778fba43.jpg	310000	0	{}	["XS", "S", "M", "L"]	2025-12-23 05:19:43.788733+00	\N
41	25	Бежевый	http://147.45.155.163:8000/uploads/images/13487745-433e-406d-a319-bd3d2e5d62e7.jpg	310000	0	{}	["XS", "S", "M", "L"]	2025-12-23 05:19:49.19269+00	\N
43	26	Бежевый	https://libertywear.uz/uploads/images/e033759c-6692-4b26-b6e8-ef8847a7384d.jpg	310000	0	{}	["XS", "S", "M", "L"]	2025-12-23 05:23:00.175651+00	\N
44	27	Бежевый	http://147.45.155.163:8000/uploads/images/bcbdbb92-5034-4327-97f5-eb2e77b906f0.jpg	320000	0	{}	["S", "M", "L"]	2025-12-23 05:29:58.352653+00	\N
49	32	Серий	http://147.45.155.163:8000/uploads/images/1553dae5-1733-4725-ba0c-e689c849a329.jpg	320000	0	{}	["S", "XS", "M", "L"]	2025-12-23 08:31:09.542279+00	\N
50	31	Черный	https://libertywear.uz/uploads/images/801065fc-cc49-402b-a883-40b295045c83.jpg	549999	0	{}	["XS", "S", "M", "L"]	2025-12-23 08:40:28.811593+00	\N
52	33	Серий	http://147.45.155.163:8000/uploads/images/10a174a3-3695-4c3d-8b28-e48f4d1ff338.jpg	370000	0	{"S": 4, "L": 5}	["S", "L"]	2025-12-23 12:05:37.697659+00	\N
54	35	Серий	http://147.45.155.163:8000/uploads/images/3fb1eb4e-b148-4332-ba3a-258fb69c300a.jpg	370000	0	{"S": 4, "L": 5}	["S", "L"]	2025-12-23 12:06:18.376661+00	\N
55	28	Черный	https://libertywear.uz/uploads/images/34d2824d-65d9-4f28-823a-fe7678d6edae.png	500000	0	{}	["XS", "S", "M", "L", "XL"]	2025-12-23 12:09:00.623843+00	\N
56	36	roziviy	http://147.45.155.163:8000/uploads/images/07bf62af-2745-4ad3-99cc-b62b32938a86.png	150000	0	{"S": 4}	["S"]	2025-12-23 12:15:59.812362+00	\N
58	34	Серий	https://libertywear.uz/uploads/images/1bb83ae9-7833-4649-b3fe-8e00dd380657.jpg	370000	0	{"S": 4, "L": 5}	["S", "L"]	2025-12-24 09:04:39.929267+00	\N
59	34	Серий	\N	370000	0	{}	["S", "M"]	2025-12-24 09:04:39.929267+00	\N
60	38	Белый	\N	120000	0	{}	["S", "M", "L"]	2025-12-24 09:43:48.25257+00	\N
61	39	Белый	\N	170000	0	{}	["XS", "S", "M"]	2025-12-25 06:49:59.997886+00	\N
62	29	Черный	https://libertywear.uz/uploads/images/56a034a7-ee52-4488-9d08-a3ddbd511630.png	500000	0	{}	["S", "M", "L", "XL", "XS"]	2025-12-25 09:20:08.294424+00	\N
73	37	Голубой	https://libertywear.uz/uploads/images/397b8ada-65d5-4254-b04c-eec87c2241a2.png	150000	0	{"S": 4}	["S"]	2025-12-26 06:07:29.392904+00	\N
74	37	Розовый	https://libertywear.uz/api/uploads/images/61992b26-f098-4800-8677-20792916ac9b.jpg	150000	0	{"S": 3}	["S"]	2025-12-26 06:07:29.392904+00	\N
75	40	розовый	https://libertywear.uz/api/uploads/images/a3391e52-7517-4142-bbd2-6be88459ef22.jpg	80000	0	{"XS": 9}	["XS"]	2025-12-26 06:23:21.419419+00	\N
76	40	голубой	https://libertywear.uz/api/uploads/images/deecbb00-8478-4766-a838-5ca3e9cb34e1.jpg	80000	0	{"XS": 10}	["XS"]	2025-12-26 06:23:21.419419+00	\N
77	41	seriy	https://libertywear.uz/api/uploads/images/441cc451-ba42-4aac-a9ef-3fb445832a1b.jpg	100000	0	{}	["S", "M"]	2025-12-26 09:50:52.400392+00	\N
78	42	Черний	https://libertywear.uz/api/uploads/images/208998ec-0dcd-4e70-94e5-9be79ade3201.png	500000	0	{}	["M", "S"]	2025-12-26 12:45:27.189116+00	\N
80	44	seriy	https://libertywear.uz/api/uploads/images/441cc451-ba42-4aac-a9ef-3fb445832a1b.jpg	100000	0	{}	["S", "M"]	2025-12-27 04:38:18.435811+00	\N
82	14	Seriy	https://libertywear.uz/uploads/images/616e13af-21c0-49f1-a444-97b6878f64e2.png	220000	0	{}	[]	2025-12-27 04:43:32.668324+00	\N
86	47	Qizil	https://libertywear.uz/api/uploads/images/ee59407d-7e63-4e44-9768-afe456d78503.JPG	300000	0	{"XS": 10, "S": 10, "L": 10, "M": 9, "XL": 9}	["XS", "S", "M", "L", "XL"]	2025-12-27 08:21:52.302355+00	\N
88	46	Beliy	\N	370000	0	{"XS": 12, "S": 10, "M": 6, "L": 5}	["XS", "S", "M", "L", "XL"]	2025-12-27 08:35:34.582794+00	\N
90	48	Белый	https://libertywear.uz/api/uploads/images/eb95741d-1830-4001-ae49-64513a0a1bb1.png	400000	0	{}	[]	2025-12-27 09:26:08.961185+00	\N
92	49	ЧЕРНИЙ	https://libertywear.uz/api/uploads/images/06fb1635-862f-4419-aa23-69ac1814d792.png	600000	0	{"S": 10, "M": 20}	["S", "M", "L", "XS"]	2025-12-27 09:52:57.666536+00	\N
93	50	Малиновый	\N	310000	0	{}	["S", "M", "L"]	2025-12-27 10:03:07.200458+00	\N
94	51	Синий	https://libertywear.uz/api/uploads/images/bbf99acc-c38c-4e75-b938-3902f0aa65e9.png	700000	0	{}	["XS", "S", "M"]	2025-12-27 10:28:19.476752+00	\N
95	45	Серий	https://libertywear.uz/api/uploads/images/043ee4a6-7c03-4264-886c-574416ccc104.png	180000	0	{}	[]	2025-12-29 07:20:21.108383+00	\N
96	30	Белый	https://libertywear.uz/uploads/images/fd368379-c43d-41d4-9f0e-6fba689e163a.png	120000	0	{}	["XS", "S", "M", "L", "XL"]	2025-12-29 07:20:53.257523+00	\N
97	43	Серий	https://libertywear.uz/api/uploads/images/62c0189b-bcd5-463c-a6ae-c3be13cd5ac3.png	180000	0	{}	[]	2025-12-29 07:21:10.768391+00	\N
98	15	Korichnivoy	https://libertywear.uz/uploads/images/8db31a59-fbe2-4838-b6ed-fd28c039c321.jpg	350000	0	{}	["XS", "S", "M", "L", "XL", "XXL"]	2025-12-29 07:21:34.765228+00	\N
99	17	Галубой	https://libertywear.uz/uploads/images/4fe14bfa-e07b-4576-a0fa-ca5e6b203e37.jpg	380000	0	{}	["S", "M", "L", "XL"]	2025-12-29 07:21:51.636926+00	\N
100	18	Коричневый	https://libertywear.uz/uploads/images/887670d1-a6a4-4c49-90ae-7820d10bee48.jpg	350000	0	{}	["XS", "M", "S"]	2025-12-29 07:22:04.088659+00	\N
102	52	Синий	https://libertywear.uz/api/uploads/images/c96545b8-b214-4992-8c13-90a7c0eb6a92.jpg	180000	0	{}	["S", "M", "L", "XL"]	2025-12-29 19:38:11.644798+00	\N
105	53	Синий	https://libertywear.uz/api/uploads/images/c96545b8-b214-4992-8c13-90a7c0eb6a92.jpg	180000	0	{}	[]	2025-12-29 19:54:19.434823+00	\N
106	54	Малиновый	https://libertywear.uz/api/uploads/images/d8256751-e6e2-46f2-8687-a1d8ad877415.jpg	80	0	{}	["7 \\u043b\\u0435\\u0442 (122 \\u0441\\u043c)", "6 \\u043b\\u0435\\u0442 (118 \\u0441\\u043c)", "5 \\u043b\\u0435\\u0442 (110 \\u0441\\u043c)"]	2025-12-29 20:10:09.637035+00	\N
107	55	Малиновый	https://libertywear.uz/api/uploads/images/c2e377b2-0f35-46d1-8407-d8ffe7ea94f5.jpg	80	0	{}	[]	2025-12-30 03:14:28.09635+00	\N
109	56	Малиновый	https://libertywear.uz/api/uploads/images/b2001fe7-3f73-4a09-abb3-f93dbdd4630a.jpg	80000	0	{}	[]	2025-12-30 03:26:57.610639+00	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, category_id, stock, created_at, updated_at, is_active, description_title, material, branding, packaging, size_guide, delivery_info, return_info, exchange_info, name_translations, description_translations, description_title_translations, material_translations, branding_translations, packaging_translations, size_guide_translations, delivery_info_translations, return_info_translations, exchange_info_translations) FROM stdin;
37	Пижама для девочек, с принтом	Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. 	19	10	2025-12-23 12:16:02.036916+00	2025-12-25 10:25:24.565772+00	t	test	Кулирная гладь, 100% хлопок	Liberty	Доставляется в фирменном пакете Liberty	\N	Мы доставляем заказы по всему Узбекистану.\nПо Ташкенту: 1–2 дня, стоимость — 40 000 сум.\nПо регионам: 2–4 дня, стоимость зависит от области.\nЭкспресс-доставка: по согласованию, стоимость — 50 000 сум.\nПосле оформления заказа наш менеджер свяжется с вами для подтверждения деталей доставки.	Если товар не подошёл, вы можете оформить обмен или возврат в течение 10 дней	Если товар не подошёл, вы можете оформить обмен или возврат в течение 10 дней	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	Aurora GORE-TEX® Shell	Эта лёгкая, водо- и ветронепроницаемая куртка создана для современных женщин, которые ценят стиль и комфорт в любых погодных условиях. Идеальна для городских прогулок и активного отдыха.	1	99	2025-12-15 00:41:03.030354+00	2025-12-23 04:47:30.929157+00	f	Стиль, защита и комфорт в одной куртке	100% полиэстер с мембраной GORE-TEX®, водо- и ветронепроницаемый, дышащий, лёгкий.	Минималистичный логотип Aurora на груди и рукаве, с отражающими элементами для безопасности в темное время суток.	Поставляется в фирменной сумке Aurora с инструкцией по уходу.	S – Обхват груди: 90–95 см\nM – Обхват груди: 96–105 см\nL – Обхват груди: 106–115 см\nXL – Обхват груди: 116–125 см	Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS.	Вы можете вернуть товар в течение 30 дней с момента получения.	Обмен товара возможен в течение 14 дней.	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	тест 1	тест 1	3	0	2025-12-15 04:45:17.512706+00	2025-12-23 06:11:41.628924+00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	Женский свитшот 	1.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	56	3	2025-12-23 12:05:40.785692+00	2025-12-24 09:04:39.929267+00	t	92% ХЛОПОК, 8% ЭЛАСТАН Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	1.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	Женский Футболка	Женский Футболка	55	3	2025-12-24 09:43:48.25257+00	2025-12-24 09:45:31.928062+00	f	92% ХЛОПОК, 8% ЭЛАСТАН Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	Мужской Комплект	test	69	32	2025-12-23 05:38:28.668653+00	2025-12-27 04:26:30.611924+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	Detskiy  Копия	test	18	12	2025-12-27 04:38:18.435811+00	\N	t	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	новоражденный Боди	tes	15	10	2025-12-27 04:41:46.679307+00	\N	t	tes	tes	\N	\N	0-12месяц	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	Мужчины	test	66	14	2025-12-26 12:45:27.189116+00	2025-12-27 09:53:37.347252+00	f	test	test	test	test	M L razmer	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	ПИЖАМА ДЛЯ ДЕВОЧЕК.	1.ИФОРМАЦИЯ: Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. \n2.РАЗМЕРЫ: 86-122 рост/1-7 лет\n3.СОСТАВ И УХОД: \nСОСТАВ\nВНЕШНЯЯ ЧАСТЬ\n100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\nУХОД\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n\n	13	7	2025-12-15 06:50:32.712656+00	2025-12-20 23:27:32.616177+00	t	Libertywear Uzbekiston 	100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\n	uzbekistan 	\N	РАЗМЕРЫ: 86-122 рост/1-7 лет	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	Женский Футболка	test 	55	3	2025-12-25 06:49:59.997886+00	\N	t	92% ХЛОПОК, 8% ЭЛАСТАН Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	ПИЖАМА ДЛЯ ДЕВОЧЕК.	1.ИФОРМАЦИЯ: Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. \n2.РАЗМЕРЫ: 86-122 рост/1-7 лет\n3.СОСТАВ И УХОД: \nСОСТАВ\nВНЕШНЯЯ ЧАСТЬ\n100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\nУХОД\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n\n\n\n	14	5	2025-12-15 06:37:55.875538+00	2025-12-20 23:27:47.323046+00	t	Libertywear.uz Uzbekistan	Руководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\nНе использовать машинную сушку\n\n4.УЗНАТЬ О НАЛИЧИИ ТОВАРА В МАГАЗИНЕ:\n\n	\N	\N	86-122 рост/1-7 лет	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	ПИЖАМА ДЛЯ МАЛЬЧИКОВ	1.ИФОРМАЦИЯ: Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. Принт «КОСМОС».2.РАЗМЕРЫ: 86-122 рост/1-7 лет\n3.СОСТАВ И УХОД: \nСОСТАВ\nВНЕШНЯЯ ЧАСТЬ\n100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\nУХОД\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n	16	10	2025-12-15 06:10:11.805305+00	2025-12-20 23:28:23.132371+00	t	Руководство по уходу за одеждой Машинная стирка при температуре до 30ºC с коротким циклом отжима Отбеливание запрещено Гладить при температуре до 110ºC  Химчистка запрещена Не использовать машинную сушку	100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\nУХОД\nУхаживайте за одеждой, чтобы продлить срок ее службы.\n	libertywear Uzbekistan 	\N	2.РАЗМЕРЫ: 86-122 рост/1-7 лет	5.ДОСТАВКА, ОБМЕН И ВОЗВРАТ	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	Костюм спортивный	Мужской спортивный костюм включает в толстовку и брюки. Часть коллекции "Осень-зима 2025" и изготовленный с любовью в России, этот костюм относится к категории мужской спортивной одежды премиум-класса. Какие преимущества предлагает этот спортивный костюм мужской теплый из флиса и хлопка?\n\nОн подходит для многочисленных сценариев использования. Будь то тренировка в тренажерном зале, бег по дорожке или прогулка по городу, этот костюм для тренировок является отличной одеждой для энергичных мужчин.	17	5	2025-12-20 11:04:19.741546+00	2025-12-20 23:30:52.360612+00	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	Футболка	test	65	11	2025-12-23 05:48:36.314678+00	\N	t	test	test	testtest	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	Пижама для девочек, с принтом	Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. 	19	100	2025-12-26 06:23:21.419419+00	\N	t	\N	Материал: Кулирная гладь, 100% хлопок	Liberty	Доставляется в фирменном пакете Liberty	\N	Мы доставляем заказы по всему Узбекистану. По Ташкенту: 1–2 дня, стоимость — 40 000 сум. По регионам: 2–4 дня, стоимость зависит от области. Экспресс-доставка: по согласованию, стоимость — 50 000 сум. После оформления заказа наш менеджер свяжется с вами для подтверждения деталей доставки.	\N	Если товар не подошёл, вы можете оформить обмен или возврат в течение 10 дней	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	Дети Младенцы и новоражденный Боди	 новоражденный Боди	15	10	2025-12-27 04:35:05.903224+00	\N	t	\N	\N	\N	\N	0-12месяц	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	Jenskiy kofta	test	55	10	2025-12-27 08:14:48.18963+00	\N	t	test	test	test	test	M<L	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	ПИЖАМА ДЛЯ ДЕВОЧЕК	1.ИФОРМАЦИЯ: Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. Принт «KEEP ON GROWING».	19	30	2025-12-27 09:14:51.552462+00	\N	t	ВНЕШНЯЯ ЧАСТЬ 100% ХЛОПОК СЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ УХОД Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\n	100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\n	\N	.РАЗМЕРЫ: 86-122 рост/1-7 лет	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	Futbolka qiz bolalar uchun	test	28	20	2025-12-27 08:21:52.302355+00	2025-12-27 09:23:55.095784+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	Мужской Комплект	test	3	0	2025-12-27 10:28:19.476752+00	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	ПИЖАМА ДЛЯ ДЕВОЧЕК.	1.ИФОРМАЦИЯ: Пижама из двух предметов. Футболка с круглым вырезом и длинными рукавами. Манжеты. Брюки с эластичным поясом и манжетами. \n2.РАЗМЕРЫ: 86-122 рост/1-7 лет\n3.СОСТАВ И УХОД: \nСОСТАВ\nВНЕШНЯЯ ЧАСТЬ\n100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\nУХОД\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n	16	12	2025-12-15 06:45:29.135838+00	2025-12-20 23:29:37.459846+00	t	Машинная стирка при температуре до 30ºC с коротким циклом отжима Отбеливание запрещено Гладить при температуре до 110ºC  Химчистка запрещена Не использовать машинную сушку	ВНЕШНЯЯ ЧАСТЬ\n100% ХЛОПОК\nСЕРТИФИЦИРОВАННЫЕ МАТЕРИАЛЫ\n	Libertywear.uz Uzbekistan 	\N	РАЗМЕРЫ: 86-122 рост/1-7 лет	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	Komplekt	test	62	10	2025-12-23 04:23:41.27116+00	\N	t	Domashnaya odejda 	test	tes	testM	testssada	tetsts	tetyasd	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	Женщины комплект	test	57	20	2025-12-23 04:31:07.078937+00	\N	t	Женщины комплект	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	Женщины комплект	test	58	20	2025-12-23 04:45:33.783901+00	\N	t	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	Aurora GORE-TEX® Shell Копия	Эта лёгкая, водо- и ветронепроницаемая куртка создана для современных женщин, которые ценят стиль и комфорт в любых погодных условиях. Идеальна для городских прогулок и активного отдыха.	1	99	2025-12-15 01:19:00.352884+00	2025-12-23 04:47:39.730854+00	f	Стиль, защита и комфорт в одной куртке	100% полиэстер с мембраной GORE-TEX®, водо- и ветронепроницаемый, дышащий, лёгкий.	Минималистичный логотип Aurora на груди и рукаве, с отражающими элементами для безопасности в темное время суток.	Поставляется в фирменной сумке Aurora с инструкцией по уходу.	S – Обхват груди: 90–95 см\nM – Обхват груди: 96–105 см\nL – Обхват груди: 106–115 см\nXL – Обхват груди: 116–125 см	Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS.	Вы можете вернуть товар в течение 30 дней с момента получения.	Обмен товара возможен в течение 14 дней.	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	Aurora GORE-TEX® Shell Копия	Эта лёгкая, водо- и ветронепроницаемая куртка создана для современных женщин, которые ценят стиль и комфорт в любых погодных условиях. Идеальна для городских прогулок и активного отдыха.	1	99	2025-12-15 01:20:19.27805+00	2025-12-23 04:47:49.311156+00	f	Стиль, защита и комфорт в одной куртке	100% полиэстер с мембраной GORE-TEX®, водо- и ветронепроницаемый, дышащий, лёгкий.	Минималистичный логотип Aurora на груди и рукаве, с отражающими элементами для безопасности в темное время суток.	Поставляется в фирменной сумке Aurora с инструкцией по уходу.	S – Обхват груди: 90–95 см\nM – Обхват груди: 96–105 см\nL – Обхват груди: 106–115 см\nXL – Обхват груди: 116–125 см	Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS.	Вы можете вернуть товар в течение 30 дней с момента получения.	Обмен товара возможен в течение 14 дней.	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	Женщины комплект	test	58	15	2025-12-23 04:53:05.637258+00	\N	t	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	Женщины комплект	test	57	20	2025-12-23 04:30:36.87538+00	2025-12-23 04:53:59.078211+00	f	Женщины комплект	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	Женщины комплект	tset	58	30	2025-12-23 04:58:54.977312+00	\N	t	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	Домашние одежда	test	62	18	2025-12-23 05:05:52.154227+00	\N	t	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	Женщины комплект	test	57	14	2025-12-23 05:20:01.976659+00	2025-12-23 05:25:48.285837+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	Женщины комплект	test	57	14	2025-12-23 05:19:49.19269+00	2025-12-23 05:25:54.651916+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	Женщины комплект	test	57	14	2025-12-23 05:19:43.788733+00	2025-12-23 05:26:06.35294+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	Женщины комплект	test	57	14	2025-12-23 05:19:40.007083+00	2025-12-23 05:26:18.737689+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	Женщины комплект	test	57	14	2025-12-23 05:13:47.87345+00	2025-12-23 05:26:49.711227+00	f	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	Женщины комплект	test	56	11	2025-12-23 05:29:58.352653+00	\N	t	test	test	test	test	test	test	testtest	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	Мужской Комплект	test	69	2	2025-12-23 05:35:18.264204+00	2025-12-23 12:09:00.623843+00	t	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	Body	Chaqaloqlar uchun Body 	14	0	2025-12-22 04:39:24.303402+00	2025-12-27 04:43:32.668324+00	t	\N	\N	\N	\N	Razmer 3-6 oylik	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	Luna Oversize Hoodie	Комфортный и стильный худи для повседневной носки. Мягкий материал, свободный крой и минималистичный дизайн делают его идеальным для дома, прогулок и встреч с друзьями.	3	148	2025-12-15 01:01:36.113759+00	2025-12-23 06:11:00.094774+00	f	Стильный комфорт на каждый день	80% хлопок, 20% полиэстер; мягкий флисовый внутренний слой, приятный на ощупь и тёплый.	Минималистичный вышитый логотип Luna на груди, доступен в нескольких цветовых вариантах.	Поставляется в эко-упаковке с фирменной наклейкой Luna.	S – Длина: 65 см, Обхват груди: 90 см\nM – Длина: 68 см, Обхват груди: 95 см\nL – Длина: 71 см, Обхват груди: 100 см\nXL – Длина: 74 см, Обхват груди: 105 см	Бесплатная стандартная доставка при заказе на сумму свыше 500,000 UZS.\n	Вы можете вернуть товар в течение 30 дней с момента получения.	Обмен товара возможен в течение 14 дней.	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	Женская пижама 	. ИФОРМАЦИЯ: Женская пижама из мягкого хлопкового трикотажа — идеальный выбор для комфортного сна и уютного отдыха дома. Модель состоит из рубашки и брюк. Рубашка с элегантным отложным воротником с лацканами, застёжкой на пуговицы, двумя удобными карманами спереди и короткими рукавами обеспечивает свободу движений и стильный внешний вид. Брюки с эластичной резинкой, аккуратно скрытой в поясе, и прямыми широкими штанинами дарят максимальный комфорт и расслабленную посадку. Пижама сочетает в себе практичность, комфорт и женственный дизайн, подходящий для любого времени года	63	100	2025-12-23 08:31:09.542279+00	\N	t	92% ХЛОПОК, 8% ЭЛАСТАН Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	СОСТАВ И УХОД: \n92% ХЛОПОК, 8% ЭЛАСТАН\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n	Руководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n\n	\N	РАЗМЕРЫ: S-2XL	3.СОСТАВ И УХОД: \n92% ХЛОПОК, 8% ЭЛАСТАН\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	Женский бомбер - Ak'yus	Женский бомбер - Ak'yus\nИФОРМАЦИЯ: Стильный и универсальный укороченный бомбер оверсайз из футера пенье. Для создания повседневных и спортивных образов. Эластичные трикотажные манжеты, воротник-стойка и подол гарантируют посадку. Пошив Аккуратный, ровные швы, использована качественная фурнитура.  \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n\n	58	2	2025-12-23 06:09:45.561792+00	2025-12-23 08:40:28.811593+00	t	СОСТАВ И УХОД:  100% ХЛОПОК Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \n	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	Женский свитшот 	1.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	18	3	2025-12-23 12:05:37.697659+00	\N	t	92% ХЛОПОК, 8% ЭЛАСТАН Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	1.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	Женский свитшот 	1.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	18	3	2025-12-23 12:06:18.376661+00	\N	t	92% ХЛОПОК, 8% ЭЛАСТАН Ухаживайте за одеждой, чтобы продлить срок ее службы. Стирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. 	1.\tИФОРМАЦИЯ: Стильный и универсальный оверсайз свитшот. Свитшоты обеспечивают максимальную свободу движений, не сковывают и позволяют чувствовать себя непринужденно. Необработанные швы расположены таким образом, чтобы подчеркнуть линии кроя и придать "незавершенный" вид.\n2. РАЗМЕРЫ: S-2XL\n3.СОСТАВ И УХОД: \n100% ХЛОПОК\nУхаживайте за одеждой, чтобы продлить срок ее службы.\nСтирка при низкой температуре и программы мягкого отжима обеспечивают более бережное отношение к одежде и помогают сохранять цвет, форму и структуру ткани. \nРуководство по уходу за одеждой\nМашинная стирка при температуре до 30ºC с коротким циклом отжима\nОтбеливание запрещено\nГладить при температуре до 110ºC \nХимчистка запрещена\n	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	Dlya devochek 	test	19	0	2025-12-23 12:15:59.812362+00	\N	t	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	Detskiy 	test	18	12	2025-12-26 09:50:52.400392+00	\N	t	test	test	test	test	test	test	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	Мужской спортивный костюм	Мужской спортивный костюм включает в толстовку и брюки. Часть коллекции "Осень-зима 2025" и изготовленный с любовью в России, этот костюм относится к категории мужской спортивной одежды премиум-класса. Какие преимущества предлагает этот спортивный костюм мужской теплый из флиса и хлопка? Он подходит для многочисленных сценариев использования. Будь то тренировка в тренажерном зале, бег по дорожке или прогулка по городу, этот костюм для тренировок является отличной одеждой для энергичных мужчин.	3	100	2025-12-27 09:52:04.233936+00	\N	t	Мужской спортивный костюм	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	Женщины комплект	test	57	0	2025-12-27 10:03:07.200458+00	\N	t	test	test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	Пижама для мальчика   	Размеры: 86-122 Состав: 100% хлопок 	38	100	2025-12-29 19:12:11.082708+00	2025-12-29 19:38:11.644798+00	t	Размеры: 86-122 Состав: 100% хлопок 	Размеры: 86-122 Состав: 100% хлопок 	\N	\N	Размеры: 86-122 Состав: 100% хлопок 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	Пижама для мальчика    Копия	Размеры: 86-122 Состав: 100% хлопок 	38	100	2025-12-29 19:51:49.378614+00	\N	t	Размеры: 86-122 Состав: 100% хлопок 	Размеры: 86-122 Состав: 100% хлопок 	\N	\N	Размеры: 86-122 Состав: 100% хлопок 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	Пижама для девочек Эльза❄️   Размеры: 86-122 Состав: 100% хлопок  Цена: 80.000	 Размеры: 86-122 Состав: 100% хлопок  	12	5	2025-12-29 20:10:09.637035+00	\N	t	\N	Состав: 100% хлопок  	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	Пижама для девочек Эльза❄️   Размеры: 86-122 Состав: 100% хлопок  Цена: 80.000	  Размеры: 86-122 Состав: 100% хлопок  	12	5	2025-12-30 03:14:28.09635+00	\N	t	Пижама для девочек	Состав: 100% хлопок  	Libertywear Uzbekistan 	\N	 Размеры: 86-122 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	 для девочек 	\nПижама для девочек \n\nРазмеры: 86-122\nСостав: 100% хлопок \nЦена: 80.000	19	4	2025-12-30 03:21:20.764519+00	2025-12-30 03:26:57.610639+00	t	Супер новинка!  Пижама для девочек   Размеры: 86-122 Состав: 100% хлопок  Цена: 80.000	азмеры: 86-122 Состав: 100% хлопок 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, key, value, description, created_at, updated_at) FROM stdin;
2	show_team_block	false	Показывать блок команды на странице О компании	2025-12-27 12:53:15.798801+00	2025-12-27 12:56:30.924337+00
3	about_hero_title	{"ru":"О компании","uz":"Kompaniya haqida","en":"About Company","es":"Acerca de la empresa"}	Заголовок hero секции на странице О компании (JSON с переводами)	2025-12-27 13:00:43.321742+00	2025-12-27 13:02:37.690499+00
4	about_hero_description	{"ru":"Liberty — это больше, чем просто бренд одежды. Это философия стиля, качества и индивидуальности.","uz":"Liberty — bu shunchaki kiyim brendi emas. Bu uslub, sifat va individualitet falsafasidir.","en":"Liberty is more than just a clothing brand. It is a philosophy of style, quality and individuality.","es":"Liberty es más que una marca de ropa. Es una filosofía de estilo, calidad e individualidad."}	Описание hero секции на странице О компании (JSON с переводами)	2025-12-27 13:00:43.321742+00	2025-12-27 13:02:37.877023+00
1	show_partners_block	true	Показывать блок партнеров на главной странице	2025-12-26 10:06:02.799611+00	2025-12-29 19:43:17.385435+00
\.


--
-- Data for Name: slider_slides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.slider_slides (id, title, link, image_url_desktop, image_url_mobile, alt_text, "order", is_active, created_at, updated_at) FROM stdin;
11	Элегантная Легкость Стильные трикотажные изделия для уверенности в каждом моменте жизни	\N	https://libertywear.uz/api/uploads/images/f64e4f41-3619-46b1-ad98-4994624a92da.png	https://libertywear.uz/api/uploads/images/f64e4f41-3619-46b1-ad98-4994624a92da.png	\N	2	f	2025-12-29 18:39:55.694068+00	\N
12	https://libertywear.uz/api/uploads/images/3accf088-10bb-4632-81c0-d5c95aea5f07.png	\N	https://libertywear.uz/api/uploads/images/3accf088-10bb-4632-81c0-d5c95aea5f07.png	https://libertywear.uz/api/uploads/images/3accf088-10bb-4632-81c0-d5c95aea5f07.png	\N	0	t	2025-12-29 18:41:20.134507+00	\N
13	Элегантная Легкость Стильные трикотажные изделия для уверенности в каждом моменте жизни	\N	https://libertywear.uz/api/uploads/images/a162649a-9b1a-433a-893f-fa1a6cd0d555.png	https://libertywear.uz/api/uploads/images/a162649a-9b1a-433a-893f-fa1a6cd0d555.png	\N	0	t	2025-12-29 18:42:21.633315+00	\N
14	Элегантная Легкость Стильные трикотажные изделия для уверенности в каждом моменте жизни	\N	https://libertywear.uz/api/uploads/images/db8b2801-0473-4ce9-a824-f1ec491f3950.png	https://libertywear.uz/api/uploads/images/db8b2801-0473-4ce9-a824-f1ec491f3950.png	\N	0	t	2025-12-29 18:48:17.2381+00	\N
15	https://libertywear.uz/api/uploads/images/039eb399-2f77-435c-8cb0-92e0793183b1.png	\N	https://libertywear.uz/api/uploads/images/039eb399-2f77-435c-8cb0-92e0793183b1.png	https://libertywear.uz/api/uploads/images/039eb399-2f77-435c-8cb0-92e0793183b1.png	\N	0	t	2025-12-29 18:49:06.558719+00	\N
16	https://libertywear.uz/api/uploads/images/0acf9310-87e2-4eaf-9f53-b8c5f4f605c4.png	\N	https://libertywear.uz/api/uploads/images/0acf9310-87e2-4eaf-9f53-b8c5f4f605c4.png	https://libertywear.uz/api/uploads/images/0acf9310-87e2-4eaf-9f53-b8c5f4f605c4.png	\N	0	t	2025-12-29 18:50:55.718309+00	\N
17	https://libertywear.uz/api/uploads/images/e4252927-4183-4070-98f7-fc8eba81398c.png	\N	https://libertywear.uz/api/uploads/images/e4252927-4183-4070-98f7-fc8eba81398c.png	https://libertywear.uz/api/uploads/images/e4252927-4183-4070-98f7-fc8eba81398c.png	\N	0	t	2025-12-29 18:54:15.875023+00	\N
9	Элегантная Легкость Стильные трикотажные изделия для уверенности в каждом моменте жизни	\N	https://libertywear.uz/api/uploads/images/1d409bed-9c42-4343-b375-2e4427308482.png	https://libertywear.uz/api/uploads/images/1d409bed-9c42-4343-b375-2e4427308482.png	\N	0	t	2025-12-29 18:34:47.985977+00	2025-12-29 18:59:52.493573+00
\.


--
-- Data for Name: social_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_links (id, links, created_at, updated_at) FROM stdin;
1	[{"name": "Instagram", "url": "https://www.instagram.com/libertyuzbekistan?igsh=ZzQ1bDUwM3J6bWN4", "icon": "FiInstagram", "iconUrl": "https://libertywear.uz/api/uploads/images/8e273bfc-ca43-40e9-b228-4bfe7933d05c.webp", "iconType": "custom"}, {"name": "Telegram", "url": "https://t.me/libertyyseller", "icon": "FiSend", "iconUrl": "https://libertywear.uz/api/uploads/images/d9165f6f-ed13-416f-8412-b584292dafd7.webp", "iconType": "custom"}, {"name": "Payme", "url": "https://libertywear.uz/api/payme/merchant", "icon": "FiVideo", "iconUrl": "https://libertywear.uz/api/uploads/images/72eeb0ec-97fe-4e60-9aa8-34fac5cefa7f.png", "iconType": "custom"}, {"name": "LW", "url": "https://libertywear.uz/", "icon": "FiLink", "iconUrl": "https://libertywear.uz/api/uploads/images/7235628a-57e3-4dfe-9dcb-2844255d9ca4.jpg", "iconType": "custom"}]	2025-12-15 00:13:51.734343+00	2025-12-27 08:09:12.596819+00
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, name, role, image, "order", created_at, updated_at, name_translations, role_translations) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, phone, state, address, pincode, city, is_email_verified, verification_code, verification_code_expires, created_at, updated_at, is_active) FROM stdin;
1	notferuz@gmail.com	$2b$12$aEkya7qpixzPiKOJ605NFeruNLETxCELpN9DN4mdnejX9T/KsMLoa	Феруз	+998935653801	tashkent_city	Карасу 1, 42 дом, 2 подьезд 3 этаж, 23 квартира	100001	Ташкент	t	\N	\N	2025-12-15 00:57:02.583041+00	\N	t
4	sarvarikvarvarik@gmail.com	$2b$12$f/jt57nie8DoPNnyzpmtA.fLq8L01bg0be5DkumFgyG8LiPmRcHAO	Sarvar Faxrutdinov	+998938848100	tashkent_region	1-ый тупик Бехзода	100000	Ташкент	t	\N	\N	2025-12-15 17:25:56.099694+00	\N	t
5	test_user_payme@example.com	sha256$67dafc9ecaa7d08d35bc0ab67dde6ac29aec6faf70c17266be868f097d262dc1	Test User Payme	+998901234567	Tashkent	Test Address 123	\N	Tashkent	t	\N	\N	2025-12-22 12:49:41.156292+00	\N	t
2	feruzmamadiev5@gmail.com	$2b$12$Zpjs7w2y5o/J9Rsv9OrCoe0c324ioVDoreH9CpdLVuCOHA5vE596G	анастасия 	+998998944554	tashkent_city	карасц	1000001	ташкент	t	\N	\N	2025-12-15 06:40:51.781832+00	2025-12-27 15:35:00.536462+00	f
6	diyorbeodilov3@gmail.com	$2b$12$vxTmYhedFlJP/mp7g66gqO8ys86vwvDWKxK9oGH.bOBL1NbsYFTnG	Dyorbek	+998946537571	tashkent_city	Muqimiy 172	\N	Chilonzor	t	\N	\N	2025-12-28 16:19:41.752364+00	\N	t
3	f.atabaeva1984@gmail.com	$2b$12$KnFRElJwCFgjDRlxtwIVxe/MKc5m0.knQpnXxjiEXhSf4mlhoriCO	feruza	+998883187778	tashkent_city	Arnasaoy7a	0001000	Toshkent	t	\N	\N	2025-12-15 07:31:56.324986+00	2025-12-28 17:18:17.264404+00	t
7	zamirakhonrustamovaa@gmail.com	$2b$12$cMXVRZ3txw4YNmXPaP23j.tO20UVCCuYI.nEDsvFpH9IIIo67H6OO	Zamirakhon Rustamova	+998991014660	\N	Uzbekistan, Богибустон	N/A	Tashkent	t	\N	\N	2025-12-30 05:10:33.911207+00	\N	t
\.


--
-- Name: about_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.about_sections_id_seq', 5, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 21, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 72, true);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 6, true);


--
-- Name: contact_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_info_id_seq', 3, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 2, true);


--
-- Name: faq_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faq_items_id_seq', 4, true);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 123, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 81, true);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partners_id_seq', 6, true);


--
-- Name: payme_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payme_transactions_id_seq', 7, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 409, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 109, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 56, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 4, true);


--
-- Name: slider_slides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.slider_slides_id_seq', 17, true);


--
-- Name: social_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_links_id_seq', 1, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: about_sections about_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_sections
    ADD CONSTRAINT about_sections_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: contact_info contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: faq_items faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT faq_items_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: payme_transactions payme_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payme_transactions
    ADD CONSTRAINT payme_transactions_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_key_key UNIQUE (key);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: slider_slides slider_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slider_slides
    ADD CONSTRAINT slider_slides_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: favorites unique_user_product_favorite; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT unique_user_product_favorite UNIQUE (user_id, product_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_site_settings_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_site_settings_key ON public.site_settings USING btree (key);


--
-- Name: ix_about_sections_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_about_sections_id ON public.about_sections USING btree (id);


--
-- Name: ix_cart_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_items_id ON public.cart_items USING btree (id);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_chat_messages_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_chat_messages_id ON public.chat_messages USING btree (id);


--
-- Name: ix_contact_info_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_contact_info_id ON public.contact_info USING btree (id);


--
-- Name: ix_contact_messages_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_contact_messages_id ON public.contact_messages USING btree (id);


--
-- Name: ix_faq_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_faq_items_id ON public.faq_items USING btree (id);


--
-- Name: ix_favorites_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_favorites_id ON public.favorites USING btree (id);


--
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_partners_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_partners_id ON public.partners USING btree (id);


--
-- Name: ix_payme_transactions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_payme_transactions_id ON public.payme_transactions USING btree (id);


--
-- Name: ix_payme_transactions_merchant_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_payme_transactions_merchant_transaction_id ON public.payme_transactions USING btree (merchant_transaction_id);


--
-- Name: ix_payme_transactions_payme_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_payme_transactions_payme_transaction_id ON public.payme_transactions USING btree (payme_transaction_id);


--
-- Name: ix_product_images_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_product_images_id ON public.product_images USING btree (id);


--
-- Name: ix_product_variants_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_product_variants_id ON public.product_variants USING btree (id);


--
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- Name: ix_slider_slides_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_slider_slides_id ON public.slider_slides USING btree (id);


--
-- Name: ix_social_links_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_social_links_id ON public.social_links USING btree (id);


--
-- Name: ix_team_members_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_team_members_id ON public.team_members USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: cart_items cart_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payme_transactions payme_transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payme_transactions
    ADD CONSTRAINT payme_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: payme_transactions payme_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payme_transactions
    ADD CONSTRAINT payme_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

\unrestrict jZsquDVsmrQvHqGcb0u5O9uWLfZ21hNM8jQea9oRK52HjqhSaQnez4PjpfEIxgZ

