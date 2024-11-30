PGDMP                  
    |            rideease_db    17.2    17.2 M    )           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            *           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            +           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            ,           1262    16388    rideease_db    DATABASE        CREATE DATABASE rideease_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Canada.1252';
    DROP DATABASE rideease_db;
                     postgres    false            x           1247    16536    complaint_status_enum    TYPE     r   CREATE TYPE public.complaint_status_enum AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);
 (   DROP TYPE public.complaint_status_enum;
       public               postgres    false            u           1247    16526    complaint_type_enum    TYPE     i   CREATE TYPE public.complaint_type_enum AS ENUM (
    'ride',
    'payment',
    'driver',
    'other'
);
 &   DROP TYPE public.complaint_type_enum;
       public               postgres    false            f           1247    16436    ride_status    TYPE     k   CREATE TYPE public.ride_status AS ENUM (
    'pending',
    'ongoing',
    'completed',
    'cancelled'
);
    DROP TYPE public.ride_status;
       public               postgres    false            `           1247    16402 	   user_role    TYPE     H   CREATE TYPE public.user_role AS ENUM (
    'passenger',
    'driver'
);
    DROP TYPE public.user_role;
       public               postgres    false            �            1259    16546 
   Complaints    TABLE     p  CREATE TABLE public."Complaints" (
    complaint_id integer NOT NULL,
    user_id integer NOT NULL,
    ride_id integer,
    complaint_text text NOT NULL,
    complaint_type public.complaint_type_enum NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    status public.complaint_status_enum DEFAULT 'open'::public.complaint_status_enum NOT NULL
);
     DROP TABLE public."Complaints";
       public         heap r       postgres    false    888    888    885            �            1259    16545    Complaints_complaint_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Complaints_complaint_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public."Complaints_complaint_id_seq";
       public               postgres    false    230            -           0    0    Complaints_complaint_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public."Complaints_complaint_id_seq" OWNED BY public."Complaints".complaint_id;
          public               postgres    false    229            �            1259    16446    Driver_Ratings    TABLE       CREATE TABLE public."Driver_Ratings" (
    rating_id integer NOT NULL,
    driver_id integer NOT NULL,
    passenger_id integer NOT NULL,
    ride_id integer NOT NULL,
    rating numeric(3,2) NOT NULL,
    review text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
 $   DROP TABLE public."Driver_Ratings";
       public         heap r       postgres    false            �            1259    16445    Driver_Ratings_rating_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Driver_Ratings_rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public."Driver_Ratings_rating_id_seq";
       public               postgres    false    222            .           0    0    Driver_Ratings_rating_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public."Driver_Ratings_rating_id_seq" OWNED BY public."Driver_Ratings".rating_id;
          public               postgres    false    221            �            1259    16502    Payments    TABLE     �  CREATE TABLE public."Payments" (
    payment_id integer NOT NULL,
    stripe_payment_id text NOT NULL,
    user_id integer NOT NULL,
    ride_id integer,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    payment_method text,
    payment_status text DEFAULT 'pending'::text NOT NULL,
    receipt_url text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
    DROP TABLE public."Payments";
       public         heap r       postgres    false            �            1259    16501    Payments_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Payments_payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."Payments_payment_id_seq";
       public               postgres    false    228            /           0    0    Payments_payment_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."Payments_payment_id_seq" OWNED BY public."Payments".payment_id;
          public               postgres    false    227            �            1259    16484    RideRequests    TABLE     �  CREATE TABLE public."RideRequests" (
    request_id integer NOT NULL,
    passenger_id integer NOT NULL,
    pickup_location text NOT NULL,
    dropoff_location text NOT NULL,
    request_time timestamp with time zone DEFAULT now(),
    status text NOT NULL,
    CONSTRAINT "RideRequests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'matched'::text, 'cancelled'::text])))
);
 "   DROP TABLE public."RideRequests";
       public         heap r       postgres    false            �            1259    16483    RideRequests_request_id_seq    SEQUENCE     �   CREATE SEQUENCE public."RideRequests_request_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public."RideRequests_request_id_seq";
       public               postgres    false    226            0           0    0    RideRequests_request_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public."RideRequests_request_id_seq" OWNED BY public."RideRequests".request_id;
          public               postgres    false    225            �            1259    16417    Rides    TABLE     �  CREATE TABLE public."Rides" (
    ride_id integer NOT NULL,
    passenger_id integer NOT NULL,
    driver_id integer NOT NULL,
    pickup_location text NOT NULL,
    dropoff_location text NOT NULL,
    pickup_time timestamp with time zone NOT NULL,
    dropoff_time timestamp with time zone NOT NULL,
    fare numeric(10,0) NOT NULL,
    status text NOT NULL,
    estimated_fare numeric(10,2) DEFAULT NULL::numeric
);
    DROP TABLE public."Rides";
       public         heap r       postgres    false            �            1259    16416    Rides_ride_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Rides_ride_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Rides_ride_id_seq";
       public               postgres    false    220            1           0    0    Rides_ride_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Rides_ride_id_seq" OWNED BY public."Rides".ride_id;
          public               postgres    false    219            �            1259    16567    UserDocuments    TABLE     �   CREATE TABLE public."UserDocuments" (
    document_id integer NOT NULL,
    user_id integer NOT NULL,
    document_type text NOT NULL,
    document_url text NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public."UserDocuments";
       public         heap r       postgres    false            �            1259    16566    UserDocuments_document_id_seq    SEQUENCE     �   CREATE SEQUENCE public."UserDocuments_document_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."UserDocuments_document_id_seq";
       public               postgres    false    232            2           0    0    UserDocuments_document_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public."UserDocuments_document_id_seq" OWNED BY public."UserDocuments".document_id;
          public               postgres    false    231            �            1259    16390    Users    TABLE     U  CREATE TABLE public."Users" (
    user_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    phone_number text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    user_type text NOT NULL,
    availability boolean DEFAULT false
);
    DROP TABLE public."Users";
       public         heap r       postgres    false            �            1259    16389    Users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Users_user_id_seq";
       public               postgres    false    218            3           0    0    Users_user_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Users_user_id_seq" OWNED BY public."Users".user_id;
          public               postgres    false    217            �            1259    16466    Vehicles    TABLE     �  CREATE TABLE public."Vehicles" (
    vehicle_id integer NOT NULL,
    driver_id integer NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    license_plate text NOT NULL,
    capacity integer NOT NULL,
    CONSTRAINT "Valid_Capacity" CHECK ((capacity > 0)),
    CONSTRAINT "Valid_Year" CHECK (((year >= 1900) AND ((year)::numeric <= EXTRACT(year FROM now()))))
);
    DROP TABLE public."Vehicles";
       public         heap r       postgres    false            �            1259    16465    Vehicles_vehicle_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Vehicles_vehicle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."Vehicles_vehicle_id_seq";
       public               postgres    false    224            4           0    0    Vehicles_vehicle_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."Vehicles_vehicle_id_seq" OWNED BY public."Vehicles".vehicle_id;
          public               postgres    false    223            _           2604    16549    Complaints complaint_id    DEFAULT     �   ALTER TABLE ONLY public."Complaints" ALTER COLUMN complaint_id SET DEFAULT nextval('public."Complaints_complaint_id_seq"'::regclass);
 H   ALTER TABLE public."Complaints" ALTER COLUMN complaint_id DROP DEFAULT;
       public               postgres    false    230    229    230            U           2604    16449    Driver_Ratings rating_id    DEFAULT     �   ALTER TABLE ONLY public."Driver_Ratings" ALTER COLUMN rating_id SET DEFAULT nextval('public."Driver_Ratings_rating_id_seq"'::regclass);
 I   ALTER TABLE public."Driver_Ratings" ALTER COLUMN rating_id DROP DEFAULT;
       public               postgres    false    222    221    222            Z           2604    16505    Payments payment_id    DEFAULT     ~   ALTER TABLE ONLY public."Payments" ALTER COLUMN payment_id SET DEFAULT nextval('public."Payments_payment_id_seq"'::regclass);
 D   ALTER TABLE public."Payments" ALTER COLUMN payment_id DROP DEFAULT;
       public               postgres    false    227    228    228            X           2604    16487    RideRequests request_id    DEFAULT     �   ALTER TABLE ONLY public."RideRequests" ALTER COLUMN request_id SET DEFAULT nextval('public."RideRequests_request_id_seq"'::regclass);
 H   ALTER TABLE public."RideRequests" ALTER COLUMN request_id DROP DEFAULT;
       public               postgres    false    225    226    226            S           2604    16420    Rides ride_id    DEFAULT     r   ALTER TABLE ONLY public."Rides" ALTER COLUMN ride_id SET DEFAULT nextval('public."Rides_ride_id_seq"'::regclass);
 >   ALTER TABLE public."Rides" ALTER COLUMN ride_id DROP DEFAULT;
       public               postgres    false    220    219    220            b           2604    16570    UserDocuments document_id    DEFAULT     �   ALTER TABLE ONLY public."UserDocuments" ALTER COLUMN document_id SET DEFAULT nextval('public."UserDocuments_document_id_seq"'::regclass);
 J   ALTER TABLE public."UserDocuments" ALTER COLUMN document_id DROP DEFAULT;
       public               postgres    false    232    231    232            P           2604    16393    Users user_id    DEFAULT     r   ALTER TABLE ONLY public."Users" ALTER COLUMN user_id SET DEFAULT nextval('public."Users_user_id_seq"'::regclass);
 >   ALTER TABLE public."Users" ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    218    217    218            W           2604    16469    Vehicles vehicle_id    DEFAULT     ~   ALTER TABLE ONLY public."Vehicles" ALTER COLUMN vehicle_id SET DEFAULT nextval('public."Vehicles_vehicle_id_seq"'::regclass);
 D   ALTER TABLE public."Vehicles" ALTER COLUMN vehicle_id DROP DEFAULT;
       public               postgres    false    224    223    224            $          0    16546 
   Complaints 
   TABLE DATA           |   COPY public."Complaints" (complaint_id, user_id, ride_id, complaint_text, complaint_type, submitted_at, status) FROM stdin;
    public               postgres    false    230   �f                 0    16446    Driver_Ratings 
   TABLE DATA           s   COPY public."Driver_Ratings" (rating_id, driver_id, passenger_id, ride_id, rating, review, created_at) FROM stdin;
    public               postgres    false    222   �f       "          0    16502    Payments 
   TABLE DATA           �   COPY public."Payments" (payment_id, stripe_payment_id, user_id, ride_id, amount, currency, payment_method, payment_status, receipt_url, description, created_at, updated_at) FROM stdin;
    public               postgres    false    228   �f                  0    16484    RideRequests 
   TABLE DATA           {   COPY public."RideRequests" (request_id, passenger_id, pickup_location, dropoff_location, request_time, status) FROM stdin;
    public               postgres    false    226   g                 0    16417    Rides 
   TABLE DATA           �   COPY public."Rides" (ride_id, passenger_id, driver_id, pickup_location, dropoff_location, pickup_time, dropoff_time, fare, status, estimated_fare) FROM stdin;
    public               postgres    false    220    g       &          0    16567    UserDocuments 
   TABLE DATA           i   COPY public."UserDocuments" (document_id, user_id, document_type, document_url, uploaded_at) FROM stdin;
    public               postgres    false    232   =g                 0    16390    Users 
   TABLE DATA           �   COPY public."Users" (user_id, name, email, password_hash, phone_number, created_at, updated_at, user_type, availability) FROM stdin;
    public               postgres    false    218   Zg                 0    16466    Vehicles 
   TABLE DATA           g   COPY public."Vehicles" (vehicle_id, driver_id, make, model, year, license_plate, capacity) FROM stdin;
    public               postgres    false    224   wg       5           0    0    Complaints_complaint_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public."Complaints_complaint_id_seq"', 1, false);
          public               postgres    false    229            6           0    0    Driver_Ratings_rating_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public."Driver_Ratings_rating_id_seq"', 1, false);
          public               postgres    false    221            7           0    0    Payments_payment_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."Payments_payment_id_seq"', 1, false);
          public               postgres    false    227            8           0    0    RideRequests_request_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public."RideRequests_request_id_seq"', 1, false);
          public               postgres    false    225            9           0    0    Rides_ride_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Rides_ride_id_seq"', 1, false);
          public               postgres    false    219            :           0    0    UserDocuments_document_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."UserDocuments_document_id_seq"', 1, false);
          public               postgres    false    231            ;           0    0    Users_user_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Users_user_id_seq"', 1, false);
          public               postgres    false    217            <           0    0    Vehicles_vehicle_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."Vehicles_vehicle_id_seq"', 1, false);
          public               postgres    false    223            x           2606    16555    Complaints Complaints_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_pkey" PRIMARY KEY (complaint_id);
 H   ALTER TABLE ONLY public."Complaints" DROP CONSTRAINT "Complaints_pkey";
       public                 postgres    false    230            n           2606    16454 "   Driver_Ratings Driver_Ratings_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public."Driver_Ratings"
    ADD CONSTRAINT "Driver_Ratings_pkey" PRIMARY KEY (rating_id);
 P   ALTER TABLE ONLY public."Driver_Ratings" DROP CONSTRAINT "Driver_Ratings_pkey";
       public                 postgres    false    222            v           2606    16513    Payments Payments_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY (payment_id);
 D   ALTER TABLE ONLY public."Payments" DROP CONSTRAINT "Payments_pkey";
       public                 postgres    false    228            t           2606    16493    RideRequests RideRequests_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."RideRequests"
    ADD CONSTRAINT "RideRequests_pkey" PRIMARY KEY (request_id);
 L   ALTER TABLE ONLY public."RideRequests" DROP CONSTRAINT "RideRequests_pkey";
       public                 postgres    false    226            l           2606    16424    Rides Rides_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public."Rides"
    ADD CONSTRAINT "Rides_pkey" PRIMARY KEY (ride_id);
 >   ALTER TABLE ONLY public."Rides" DROP CONSTRAINT "Rides_pkey";
       public                 postgres    false    220            z           2606    16575     UserDocuments UserDocuments_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public."UserDocuments"
    ADD CONSTRAINT "UserDocuments_pkey" PRIMARY KEY (document_id);
 N   ALTER TABLE ONLY public."UserDocuments" DROP CONSTRAINT "UserDocuments_pkey";
       public                 postgres    false    232            h           2606    16398    Users Users_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (user_id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public                 postgres    false    218            p           2606    16477 #   Vehicles Vehicles_license_plate_key 
   CONSTRAINT     k   ALTER TABLE ONLY public."Vehicles"
    ADD CONSTRAINT "Vehicles_license_plate_key" UNIQUE (license_plate);
 Q   ALTER TABLE ONLY public."Vehicles" DROP CONSTRAINT "Vehicles_license_plate_key";
       public                 postgres    false    224            r           2606    16475    Vehicles Vehicles_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."Vehicles"
    ADD CONSTRAINT "Vehicles_pkey" PRIMARY KEY (vehicle_id);
 D   ALTER TABLE ONLY public."Vehicles" DROP CONSTRAINT "Vehicles_pkey";
       public                 postgres    false    224            j           2606    16400    Users unique_email 
   CONSTRAINT     P   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT unique_email UNIQUE (email);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT unique_email;
       public                 postgres    false    218            �           2606    16561 "   Complaints Complaints_ride_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_ride_id_fkey" FOREIGN KEY (ride_id) REFERENCES public."Rides"(ride_id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Complaints" DROP CONSTRAINT "Complaints_ride_id_fkey";
       public               postgres    false    220    230    4716            �           2606    16556 "   Complaints Complaints_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."Complaints" DROP CONSTRAINT "Complaints_user_id_fkey";
       public               postgres    false    4712    218    230            }           2606    16455 ,   Driver_Ratings Driver_Ratings_driver_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Driver_Ratings"
    ADD CONSTRAINT "Driver_Ratings_driver_id_fkey" FOREIGN KEY (driver_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public."Driver_Ratings" DROP CONSTRAINT "Driver_Ratings_driver_id_fkey";
       public               postgres    false    222    218    4712            �           2606    16519    Payments Payments_ride_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_ride_id_fkey" FOREIGN KEY (ride_id) REFERENCES public."Rides"(ride_id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public."Payments" DROP CONSTRAINT "Payments_ride_id_fkey";
       public               postgres    false    4716    228    220            �           2606    16514    Payments Payments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public."Payments" DROP CONSTRAINT "Payments_user_id_fkey";
       public               postgres    false    228    218    4712            �           2606    16494 +   RideRequests RideRequests_passenger_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."RideRequests"
    ADD CONSTRAINT "RideRequests_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."RideRequests" DROP CONSTRAINT "RideRequests_passenger_id_fkey";
       public               postgres    false    4712    218    226            {           2606    16430    Rides Rides_driver_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Rides"
    ADD CONSTRAINT "Rides_driver_id_fkey" FOREIGN KEY (driver_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public."Rides" DROP CONSTRAINT "Rides_driver_id_fkey";
       public               postgres    false    218    220    4712            |           2606    16425    Rides Rides_passenger_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Rides"
    ADD CONSTRAINT "Rides_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public."Rides" DROP CONSTRAINT "Rides_passenger_id_fkey";
       public               postgres    false    4712    218    220            �           2606    16576 (   UserDocuments UserDocuments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserDocuments"
    ADD CONSTRAINT "UserDocuments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."UserDocuments" DROP CONSTRAINT "UserDocuments_user_id_fkey";
       public               postgres    false    218    232    4712                       2606    16478     Vehicles Vehicles_driver_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Vehicles"
    ADD CONSTRAINT "Vehicles_driver_id_fkey" FOREIGN KEY (driver_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Vehicles" DROP CONSTRAINT "Vehicles_driver_id_fkey";
       public               postgres    false    4712    218    224            ~           2606    16460 (   Driver_Ratings fk_driver_ratings_ride_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."Driver_Ratings"
    ADD CONSTRAINT fk_driver_ratings_ride_id FOREIGN KEY (ride_id) REFERENCES public."Rides"(ride_id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."Driver_Ratings" DROP CONSTRAINT fk_driver_ratings_ride_id;
       public               postgres    false    4716    220    222            $      x������ � �            x������ � �      "      x������ � �             x������ � �            x������ � �      &      x������ � �            x������ � �            x������ � �     