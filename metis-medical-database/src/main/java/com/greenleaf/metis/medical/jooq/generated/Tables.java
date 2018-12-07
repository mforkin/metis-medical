/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated;


import com.greenleaf.metis.medical.jooq.generated.tables.Answer;
import com.greenleaf.metis.medical.jooq.generated.tables.Authorities;
import com.greenleaf.metis.medical.jooq.generated.tables.Question;
import com.greenleaf.metis.medical.jooq.generated.tables.Specialty;
import com.greenleaf.metis.medical.jooq.generated.tables.Stage;
import com.greenleaf.metis.medical.jooq.generated.tables.UserResults;
import com.greenleaf.metis.medical.jooq.generated.tables.Users;
import com.greenleaf.metis.medical.jooq.generated.tables.Vignette;
import com.greenleaf.metis.medical.jooq.generated.tables.VignetteSpecialty;

import javax.annotation.Generated;


/**
 * Convenience access to all tables in public
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Tables {

    /**
     * The table <code>public.answer</code>.
     */
    public static final Answer ANSWER = com.greenleaf.metis.medical.jooq.generated.tables.Answer.ANSWER;

    /**
     * The table <code>public.authorities</code>.
     */
    public static final Authorities AUTHORITIES = com.greenleaf.metis.medical.jooq.generated.tables.Authorities.AUTHORITIES;

    /**
     * The table <code>public.question</code>.
     */
    public static final Question QUESTION = com.greenleaf.metis.medical.jooq.generated.tables.Question.QUESTION;

    /**
     * The table <code>public.specialty</code>.
     */
    public static final Specialty SPECIALTY = com.greenleaf.metis.medical.jooq.generated.tables.Specialty.SPECIALTY;

    /**
     * The table <code>public.stage</code>.
     */
    public static final Stage STAGE = com.greenleaf.metis.medical.jooq.generated.tables.Stage.STAGE;

    /**
     * The table <code>public.user_results</code>.
     */
    public static final UserResults USER_RESULTS = com.greenleaf.metis.medical.jooq.generated.tables.UserResults.USER_RESULTS;

    /**
     * The table <code>public.users</code>.
     */
    public static final Users USERS = com.greenleaf.metis.medical.jooq.generated.tables.Users.USERS;

    /**
     * The table <code>public.vignette</code>.
     */
    public static final Vignette VIGNETTE = com.greenleaf.metis.medical.jooq.generated.tables.Vignette.VIGNETTE;

    /**
     * The table <code>public.vignette_specialty</code>.
     */
    public static final VignetteSpecialty VIGNETTE_SPECIALTY = com.greenleaf.metis.medical.jooq.generated.tables.VignetteSpecialty.VIGNETTE_SPECIALTY;
}
