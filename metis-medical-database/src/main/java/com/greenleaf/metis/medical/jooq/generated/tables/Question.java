/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables;


import com.greenleaf.metis.medical.jooq.generated.Keys;
import com.greenleaf.metis.medical.jooq.generated.Public;
import com.greenleaf.metis.medical.jooq.generated.tables.records.QuestionRecord;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Question extends TableImpl<QuestionRecord> {

    private static final long serialVersionUID = -1777898498;

    /**
     * The reference instance of <code>public.question</code>
     */
    public static final Question QUESTION = new Question();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<QuestionRecord> getRecordType() {
        return QuestionRecord.class;
    }

    /**
     * The column <code>public.question.id</code>.
     */
    public final TableField<QuestionRecord, Integer> ID = createField("id", org.jooq.impl.SQLDataType.INTEGER.nullable(false).defaultValue(org.jooq.impl.DSL.field("nextval('question_id_seq'::regclass)", org.jooq.impl.SQLDataType.INTEGER)), this, "");

    /**
     * The column <code>public.question.stage_id</code>.
     */
    public final TableField<QuestionRecord, Short> STAGE_ID = createField("stage_id", org.jooq.impl.SQLDataType.SMALLINT.nullable(false), this, "");

    /**
     * The column <code>public.question.seq</code>.
     */
    public final TableField<QuestionRecord, Short> SEQ = createField("seq", org.jooq.impl.SQLDataType.SMALLINT.nullable(false), this, "");

    /**
     * The column <code>public.question.question</code>.
     */
    public final TableField<QuestionRecord, String> QUESTION_ = createField("question", org.jooq.impl.SQLDataType.CLOB.nullable(false), this, "");

    /**
     * Create a <code>public.question</code> table reference
     */
    public Question() {
        this(DSL.name("question"), null);
    }

    /**
     * Create an aliased <code>public.question</code> table reference
     */
    public Question(String alias) {
        this(DSL.name(alias), QUESTION);
    }

    /**
     * Create an aliased <code>public.question</code> table reference
     */
    public Question(Name alias) {
        this(alias, QUESTION);
    }

    private Question(Name alias, Table<QuestionRecord> aliased) {
        this(alias, aliased, null);
    }

    private Question(Name alias, Table<QuestionRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> Question(Table<O> child, ForeignKey<O, QuestionRecord> key) {
        super(child, key, QUESTION);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Identity<QuestionRecord, Integer> getIdentity() {
        return Keys.IDENTITY_QUESTION;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<QuestionRecord> getPrimaryKey() {
        return Keys.QUESTION_PK;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<QuestionRecord>> getKeys() {
        return Arrays.<UniqueKey<QuestionRecord>>asList(Keys.QUESTION_PK);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<ForeignKey<QuestionRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<QuestionRecord, ?>>asList(Keys.QUESTION__QUES_STAG_FK);
    }

    public Stage stage() {
        return new Stage(this, Keys.QUESTION__QUES_STAG_FK);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Question as(String alias) {
        return new Question(DSL.name(alias), this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Question as(Name alias) {
        return new Question(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Question rename(String name) {
        return new Question(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Question rename(Name name) {
        return new Question(name, null);
    }
}
