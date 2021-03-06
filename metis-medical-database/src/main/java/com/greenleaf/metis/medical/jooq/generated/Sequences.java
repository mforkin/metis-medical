/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated;


import javax.annotation.Generated;

import org.jooq.Sequence;
import org.jooq.impl.SequenceImpl;


/**
 * Convenience access to all sequences in public
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Sequences {

    /**
     * The sequence <code>public.answer_id_seq</code>
     */
    public static final Sequence<Integer> ANSWER_ID_SEQ = new SequenceImpl<Integer>("answer_id_seq", Public.PUBLIC, org.jooq.impl.SQLDataType.INTEGER.nullable(false));

    /**
     * The sequence <code>public.question_id_seq</code>
     */
    public static final Sequence<Integer> QUESTION_ID_SEQ = new SequenceImpl<Integer>("question_id_seq", Public.PUBLIC, org.jooq.impl.SQLDataType.INTEGER.nullable(false));

    /**
     * The sequence <code>public.specialty_id_seq</code>
     */
    public static final Sequence<Integer> SPECIALTY_ID_SEQ = new SequenceImpl<Integer>("specialty_id_seq", Public.PUBLIC, org.jooq.impl.SQLDataType.INTEGER.nullable(false));

    /**
     * The sequence <code>public.stage_id_seq</code>
     */
    public static final Sequence<Integer> STAGE_ID_SEQ = new SequenceImpl<Integer>("stage_id_seq", Public.PUBLIC, org.jooq.impl.SQLDataType.INTEGER.nullable(false));

    /**
     * The sequence <code>public.user_results_id_seq</code>
     */
    public static final Sequence<Integer> USER_RESULTS_ID_SEQ = new SequenceImpl<Integer>("user_results_id_seq", Public.PUBLIC, org.jooq.impl.SQLDataType.INTEGER.nullable(false));

    /**
     * The sequence <code>public.vignette_id_seq</code>
     */
    public static final Sequence<Integer> VIGNETTE_ID_SEQ = new SequenceImpl<Integer>("vignette_id_seq", Public.PUBLIC, org.jooq.impl.SQLDataType.INTEGER.nullable(false));
}
