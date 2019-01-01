/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables;


import com.greenleaf.metis.medical.jooq.generated.Keys;
import com.greenleaf.metis.medical.jooq.generated.Public;
import com.greenleaf.metis.medical.jooq.generated.tables.records.UserResultsRecord;

import java.time.OffsetDateTime;
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
public class UserResults extends TableImpl<UserResultsRecord> {

    private static final long serialVersionUID = -1064149733;

    /**
     * The reference instance of <code>public.user_results</code>
     */
    public static final UserResults USER_RESULTS = new UserResults();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<UserResultsRecord> getRecordType() {
        return UserResultsRecord.class;
    }

    /**
     * The column <code>public.user_results.id</code>.
     */
    public final TableField<UserResultsRecord, Integer> ID = createField("id", org.jooq.impl.SQLDataType.INTEGER.nullable(false).defaultValue(org.jooq.impl.DSL.field("nextval('user_results_id_seq'::regclass)", org.jooq.impl.SQLDataType.INTEGER)), this, "");

    /**
     * The column <code>public.user_results.username</code>.
     */
    public final TableField<UserResultsRecord, String> USERNAME = createField("username", org.jooq.impl.SQLDataType.VARCHAR(100).nullable(false), this, "");

    /**
     * The column <code>public.user_results.submission_datetime</code>.
     */
    public final TableField<UserResultsRecord, OffsetDateTime> SUBMISSION_DATETIME = createField("submission_datetime", org.jooq.impl.SQLDataType.TIMESTAMPWITHTIMEZONE.nullable(false), this, "");

    /**
     * Create a <code>public.user_results</code> table reference
     */
    public UserResults() {
        this(DSL.name("user_results"), null);
    }

    /**
     * Create an aliased <code>public.user_results</code> table reference
     */
    public UserResults(String alias) {
        this(DSL.name(alias), USER_RESULTS);
    }

    /**
     * Create an aliased <code>public.user_results</code> table reference
     */
    public UserResults(Name alias) {
        this(alias, USER_RESULTS);
    }

    private UserResults(Name alias, Table<UserResultsRecord> aliased) {
        this(alias, aliased, null);
    }

    private UserResults(Name alias, Table<UserResultsRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> UserResults(Table<O> child, ForeignKey<O, UserResultsRecord> key) {
        super(child, key, USER_RESULTS);
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
    public Identity<UserResultsRecord, Integer> getIdentity() {
        return Keys.IDENTITY_USER_RESULTS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<UserResultsRecord> getPrimaryKey() {
        return Keys.USER_RESULTS_PK;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<UserResultsRecord>> getKeys() {
        return Arrays.<UniqueKey<UserResultsRecord>>asList(Keys.USER_RESULTS_PK, Keys.USER_RES_UNQ);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<ForeignKey<UserResultsRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<UserResultsRecord, ?>>asList(Keys.USER_RESULTS__USER_ANSWER_USER_FK);
    }

    public Users users() {
        return new Users(this, Keys.USER_RESULTS__USER_ANSWER_USER_FK);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UserResults as(String alias) {
        return new UserResults(DSL.name(alias), this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UserResults as(Name alias) {
        return new UserResults(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public UserResults rename(String name) {
        return new UserResults(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public UserResults rename(Name name) {
        return new UserResults(name, null);
    }
}
