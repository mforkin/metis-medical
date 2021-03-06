/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables;


import com.greenleaf.metis.medical.jooq.generated.Keys;
import com.greenleaf.metis.medical.jooq.generated.Public;
import com.greenleaf.metis.medical.jooq.generated.tables.records.VignetteRecord;

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
public class Vignette extends TableImpl<VignetteRecord> {

    private static final long serialVersionUID = 966694202;

    /**
     * The reference instance of <code>public.vignette</code>
     */
    public static final Vignette VIGNETTE = new Vignette();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<VignetteRecord> getRecordType() {
        return VignetteRecord.class;
    }

    /**
     * The column <code>public.vignette.id</code>.
     */
    public final TableField<VignetteRecord, Integer> ID = createField("id", org.jooq.impl.SQLDataType.INTEGER.nullable(false).defaultValue(org.jooq.impl.DSL.field("nextval('vignette_id_seq'::regclass)", org.jooq.impl.SQLDataType.INTEGER)), this, "");

    /**
     * The column <code>public.vignette.name</code>.
     */
    public final TableField<VignetteRecord, String> NAME = createField("name", org.jooq.impl.SQLDataType.CLOB.nullable(false), this, "");

    /**
     * The column <code>public.vignette.seq</code>.
     */
    public final TableField<VignetteRecord, Integer> SEQ = createField("seq", org.jooq.impl.SQLDataType.INTEGER, this, "");

    /**
     * Create a <code>public.vignette</code> table reference
     */
    public Vignette() {
        this(DSL.name("vignette"), null);
    }

    /**
     * Create an aliased <code>public.vignette</code> table reference
     */
    public Vignette(String alias) {
        this(DSL.name(alias), VIGNETTE);
    }

    /**
     * Create an aliased <code>public.vignette</code> table reference
     */
    public Vignette(Name alias) {
        this(alias, VIGNETTE);
    }

    private Vignette(Name alias, Table<VignetteRecord> aliased) {
        this(alias, aliased, null);
    }

    private Vignette(Name alias, Table<VignetteRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""));
    }

    public <O extends Record> Vignette(Table<O> child, ForeignKey<O, VignetteRecord> key) {
        super(child, key, VIGNETTE);
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
    public Identity<VignetteRecord, Integer> getIdentity() {
        return Keys.IDENTITY_VIGNETTE;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<VignetteRecord> getPrimaryKey() {
        return Keys.VIGNETTE_PK;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<VignetteRecord>> getKeys() {
        return Arrays.<UniqueKey<VignetteRecord>>asList(Keys.VIGNETTE_PK);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Vignette as(String alias) {
        return new Vignette(DSL.name(alias), this);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Vignette as(Name alias) {
        return new Vignette(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Vignette rename(String name) {
        return new Vignette(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Vignette rename(Name name) {
        return new Vignette(name, null);
    }
}
